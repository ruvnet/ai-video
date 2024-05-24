# GPT-4o Media Stream Capture and Analysis

## Project Overview

This project provides a web application that captures media streams from various sources such as a webcam, desktop, or specific applications. It captures frames at intervals and uses AI to analyze and summarize the frames, providing insights using GPT-4.

[![GPT-4o Media Stream Capture and Analysis](https://github.com/ruvnet/ai-video/blob/main/assets/preview.png?raw=true)](https://huggingface.co/spaces/ruv/ai-video)

## Demo Link
- https://huggingface.co/spaces/ruv/ai-video

### Key Features

- **Media Stream Capture**: Capture video streams from a webcam, screen, or specific applications.
- **Frame Analysis**: Use OpenAI's GPT-4 to analyze captured frames for text, objects, context, and other details.
- **Customizable Prompts**: Customize the prompt used for frame analysis.
- **API Integration**: Integrate with OpenAI's API for frame analysis.

## Project Structure

- `app.py`: The main server-side application code using Quart.
- `templates/index.html`: The HTML template for the web application.
- `static/script.js`: The client-side JavaScript for handling media streams and interaction with the backend.

## API Endpoints

- **`GET /`**: Serves the main web application.
- **`POST /process_frame`**: Processes a captured frame and returns the analysis result.

### `POST /process_frame`
- **Request Body**:
  ```json
  {
      "image": "data:image/jpeg;base64,<base64-encoded-image>",
      "prompt": "Analyze this frame",
      "api_key": "<OpenAI API Key>"
  }
  ```
- **Response**:
  ```json
  {
      "response": "<Analysis result in markdown format>"
  }
  ```

## Potential Uses

- **Remote Monitoring**: Capture and analyze video streams for remote monitoring applications.
- **Educational Purposes**: Use AI to analyze and summarize educational video content.
- **Content Creation**: Automate the analysis and summarization of video content for creators.

## Customization

- **Prompts**: Customize the analysis prompt via the settings panel in the web application.
- **Refresh Rate**: Adjust the frame capture interval through the settings panel.
- **API Key**: Configure the OpenAI API key via the settings panel.

## Deployment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ruvnet/ai-video.git
   cd ai-video
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables**:
   ```bash
   export OPENAI_API_KEY=<your_openai_api_key>
   ```

4. **Run the Application**:
   ```bash
   python app.py
   ```

5. **Access the Application**:
   Open your web browser and navigate to `http://localhost:5000`.

## `requirements.txt`
```plaintext
quart
opencv-python-headless
httpx
numpy
```
  
### API Endpoints


## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
 
