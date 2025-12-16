from flask import Blueprint, request, jsonify
from routes.utils import process_image
from PIL import Image
import os

modify_image = Blueprint('modify_image', __name__)

pipe = None

def get_pipeline():
    global pipe
    if pipe is None:
        print("Loading Instruct-Pix2Pix model... (this may take a while on first run)")
        # Lazy imports to speed up server start
        import torch
        from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler

        model_id = "timbrooks/instruct-pix2pix"
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if device == "cuda" else torch.float32
        
        print(f"Loading model on {device} with {dtype}")
        
        pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
            model_id, 
            torch_dtype=dtype, 
            safety_checker=None
        )
        pipe.to(device)
        pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
        
        if device == "cuda":
            pipe.enable_attention_slicing()
            
        print("Model loaded successfully!")
    return pipe

@modify_image.route('/api/modify-image', methods=['POST'])
def modify_image_route():
    """
    Modify an image based on a text prompt using local Instruct-Pix2Pix.
    """
    image_source = request.form.get('image_source')
    prompt = request.form.get('prompt')

    if not image_source:
        return jsonify({"error": "No image source provided"}), 400
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    print(f"Received modification request with prompt: {prompt}")

    def do_modification(image):
        try:
            pipeline = get_pipeline()
            
            original_size = image.size
            
            max_size = 512
            ratio = min(max_size / original_size[0], max_size / original_size[1])
            new_size = (int(original_size[0] * ratio), int(original_size[1] * ratio))
            
            new_size = (new_size[0] - (new_size[0] % 8), new_size[1] - (new_size[1] % 8))
            
            input_image = image.resize(new_size, Image.Resampling.LANCZOS).convert("RGB")
            
            print(f"Generating image with prompt: '{prompt}' (Input Size: {new_size})")
            
            result = pipeline(
                prompt, 
                image=input_image, 
                num_inference_steps=20, 
                image_guidance_scale=1.2,
                guidance_scale=7.5
            ).images[0]
            
            final_image = result.resize(original_size, Image.Resampling.LANCZOS)
            
            return final_image

        except Exception as e:
            print(f"General Error in do_modification: {e}")
            import traceback
            traceback.print_exc()
            return image

    return process_image(image_source, do_modification)
