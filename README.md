# 🍽️ Nutriject — AI-Powered Nutrition Tracker

**Nutriject** is an AI-based web platform designed to help users automatically monitor their nutritional intake using cutting-edge **Computer Vision**. With a simple food image, Nutriject detects the type of food and instantly calculates its nutritional value — no manual input needed.

> ⚡ Just take a photo. Let Nutriject do the rest.

---

## 🔍 Key Features

- 🧠 **AI-Powered Detection**: Automatically recognizes food items from images using a custom-trained object detection model.
- 📊 **Nutritional Analysis**: Calculates macro and micronutrients using a trusted nutrition database.
- 💻 **No Manual Input**: Fully automated, ideal for busy individuals, athletes, and health-conscious users.
- 📱 **Modern UI/UX**: Built with React.js for a fast and responsive web experience.

---

## 🧠 The AI Model

The object detection model behind Nutriject was trained using a combination of **open food datasets** and **custom image data** for improved accuracy on local cuisines and real-life portions.

- Trained with **YOLOv8** via **Ultralytics** on [Google Colab]
- Fine-tuned on personal and real-world food data for better generalization
- For details and model file, visit this drive:  
  👉 [Model File Drive](https://drive.google.com/drive/folders/1dsuDrnyWxShcplSJkroYt3cYS70xTABS?usp=sharing)

---

## 🛰️ Model Deployment

The model is served using:

- 🧠 **Google Colab** as the compute environment
- 🌐 **Ngrok** to expose the local server to a public URL
- 🚀 **FastAPI** as the lightweight backend API

To run the model server:

1. Open the [Colab Deployment Notebook](https://colab.research.google.com/drive/1e__wjtRh_vfeO4WIU3j9G82b4lXQd349?usp=sharing)
2. Connect your Google Drive and mount the model assets [Model File Drive](https://drive.google.com/drive/folders/1dsuDrnyWxShcplSJkroYt3cYS70xTABS?usp=sharing)
3. Paste your **Ngrok API key** to the cell
4. Copy the **Ngrok public URL** once the server is running

---

## 🚀 Getting Started (Frontend)

To use the Nutriject Web App:

1. **Clone this repository**:

   ```bash
   git clone https://github.com/yourusername/nutriject.git
   cd nutriject

   ```

2. **Update the API URL**:  
   Replace all API endpoint URLs inside the React project with the **Ngrok public URL** obtained from the Colab deployment.

   Specifically, update the API URL in the following files:

   - `src/pages/PhotoInput.jsx`
   - `src/services/api.js`

3. **Install dependencies**:

   ```bash
   npm install

   ```

4. **Start the UI Website**:
   npm start

Now, you're ready to test the app. Upload a food image and watch Nutriject break down the nutrition info automatically! 🍱

## 🧰 Tech Stack

- **Frontend**: React.js
- **Backend**: FastAPI (served via Colab + Ngrok)
- **Model**: YOLOv8 (Ultralytics)
- **Deployment**: Google Colab for backend API
- **Data**: Custom + Public Food Datasets

---

## 🖼️ Sample Use Case

Check out before-after visual examples (coming soon) where Nutriject identifies meals and outputs their nutritional content — perfect for creators, nutritionists, and dieticians.

---

## 🤝 Contributions

Contributions, feature suggestions, or feedback are welcome!  
Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License** — use freely with attribution.

---

> “Track smart, eat smart. Nutriject helps you know your plate better.”
