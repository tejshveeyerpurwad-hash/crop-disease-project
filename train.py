import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

IMG_SIZE = 224

train = ImageDataGenerator(rescale=1./255)
val = ImageDataGenerator(rescale=1./255)

train_data = train.flow_from_directory('dataset/train', target_size=(224,224))
val_data = val.flow_from_directory('dataset/validation', target_size=(224,224))

base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))

x = GlobalAveragePooling2D()(base.output)
output = Dense(train_data.num_classes, activation='softmax')(x)

model = Model(inputs=base.input, outputs=output)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(train_data, validation_data=val_data, epochs=5)

model.save("model/crop_model.h5")

print("Model trained ✅")
