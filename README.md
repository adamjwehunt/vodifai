# Vodifai YouTube Transcripts

The Vodifai YouTube Transcript App is an application developed using Next.js, TypeScript, Sass, and GPT-3. It offers a clean, Spotify-inspired design that allows users to view and search through transcripts of YouTube videos effortlessly.

## Getting Started

### Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Features

### Video Selection

The app allows users to select a YouTube video by category or through a search function.

### Transcript View

Watch a YouTube video and have a fantastic way to view the transcript. The application also provides the ability to watch just the transcript while the video is playing.

### Recap with GPT-3

Read a recap generated by GPT-3 text-davinci-003 model from the video's transcript. The recap feature uses AI to analyze the video's transcript and create a concise summary, which can be especially useful for longer videos where the transcript is trimmed before AI analysis.

### Text-to-Speech Recap

The AI-generated recap can be listened to with a text-to-speech feature, allowing users to digest the video's main points audibly.

### Copy Transcript Button

A convenient feature to copy the entire transcript with a single button click.

### Video Download

Users can download YouTube videos directly from the application.

### Share Links

Share links to the video's transcript or recap easily with others.

### Bypass Search

Bypass the search function by directly pasting YouTube links into the app.

## UI/UX

The application emphasizes a clean, Spotify-like UI, providing an uncluttered and visually pleasing user experience. The app directory introduced in Next.js 13 has been utilized to maintain an organized structure.

# Enjoy!
