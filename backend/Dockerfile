FROM node:20-slim

RUN apt-get update && apt-get install -y \
    libreoffice ffmpeg python3 python3-pip curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Background removal: install rembg and bake the model into the image so there is no download on cold start
RUN pip3 install --no-cache-dir --break-system-packages rembg onnxruntime pillow pdf2docx
ARG REMBG_MODEL=u2net
ENV REMBG_MODEL=${REMBG_MODEL}
RUN python3 -c "from rembg import new_session; new_session('${REMBG_MODEL}')"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 10000
CMD ["node", "server.js"]
