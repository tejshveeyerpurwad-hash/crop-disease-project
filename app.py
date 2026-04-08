from flask import Flask, render_template, request
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

app = Flask(__name__)

model = tf.keras.models.load_model("model/crop_model.h5")
classes = ['Healthy', 'Diseased']

UPLOAD_FOLDER = "static/uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def predict(img_path):
    img = image.load_img(img_path, target_size=(224,224))
    img = image.img_to_array(img)/255.0
    img = np.expand_dims(img, axis=0)
    pred = model.predict(img)
    return classes[np.argmax(pred)]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def result():
    file = request.files['file']
    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path)

    res = predict(path)

    return render_template('index.html', prediction=res, image=path)

if __name__ == "__main__":
    app.run(debug=True)