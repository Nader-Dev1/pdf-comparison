const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(fileUpload());

app.post('/compare', async (req, res) => {
  const ref = req.files?.reference;
  const current = req.files?.current;

  if (!ref || !current) return res.status(400).send('ملفين مطلوبين');

  try {
    const refData = await pdfParse(ref.data);
    const currentData = await pdfParse(current.data);

    const refText = refData.text.split('\n').map(t => t.trim());
    const currText = currentData.text.split('\n').map(t => t.trim());

    const diffs = refText.filter(line => line && !currText.includes(line));

    res.json(diffs.length ? diffs : ['✅ لا توجد فروقات بين الملفين']);
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ أثناء قراءة الملفات');
  }
});

app.listen(5000, () => console.log('✅ Server running on port 5000'));
