const AssemblyAI = require('assemblyai').AssemblyAI; // Mengubah dari import ke require
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config(); 
const upload = multer({ dest: 'uploads/' }); // Tempat menyimpan file audio sementara

app.set('view engine', 'ejs');

//route
app.get('/', (req, res) => {
    res.render('main');
  });



const client = new AssemblyAI({
  apiKey: process.env.API_KEY,
});


// Request parameters where speaker_labels has been enabled
app.post('/upload', upload.single('audio'), async (req, res) => {
    const audioFilePath = req.file.path;
  
    const data = {
      audio: audioFilePath,
      speaker_labels: true
    };
  
    try {
      const transcript = await client.transcripts.transcribe(data);
      res.json(transcript);
      // write the respone into transcript.txt
      fs.writeFileSync('transcript.txt', transcript.text);

      // write the transcript into json
      console.log(transcript.text);
      fs.writeFileSync('transcript.json', JSON.stringify(transcript, null, 2));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error transcribing audio');
    }
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});