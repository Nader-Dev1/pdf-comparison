document.getElementById("comareBtn").addEventListener("click", async () => {
    const refFile = document.getElementById("refFile").files[0];
    const newFile = document.getElementById("newFile").files[0];
    const resultsDiv = document.getElementById("results");
  
    if (!refFile || !newFile) {
      resultsDiv.innerHTML = "⚠️ برجاء اختيار ملفين أولاً.";
      return;
    }
  
    resultsDiv.innerHTML = "⏳ جاري المراجعة...";
  
    const formData = new FormData();
    formData.append("reference", refFile);
    formData.append("current", newFile);
  
    try {
     const res = await fetch("https://pdf-comparison-seven.vercel.app/compare", {
    method: "POST",
    body: formData
      });
  
      const data = await res.json();
  
      // لو مفيش فروقات
      if (data.length === 1 && data[0].startsWith("✅")) {
        resultsDiv.innerHTML = `<p class="success">${data[0]}</p>`;
      } else {
        // لو فيه فروقات
        resultsDiv.innerHTML = `
          <h3>الاختلافات:</h3>
          <ul>
            ${data.map(line => `<li>${line}</li>`).join("")}
          </ul>
        `;
      }
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "❌ حدث خطأ أثناء المقارنة.";
    }
  });

  
