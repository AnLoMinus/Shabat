# מדריך הדפסה לקלפי שבת

מטרה: יצירת סטים מודפסים של קלפי שבת בגיליונות A4 לרוחב, עם קלפים בגודל מדויק של 7×10 ס״מ (70×100 מ״מ).

## מפרט טכני

- **גודל עמוד**: A4 לרוחב (297×210 מ״מ).
- **גודל קלף**: 70×100 מ״מ (7×10 ס״מ).
- **מרווחים מומלצים**:
  - שוליים חיצוניים: 2 מ״מ לכל הפחות (מומלץ 3–5 מ״מ נוספת לכיוון חיתוך).
  - ריווח בין קלפים: 3 מ״מ (מתאים לשני כרטיסים בשורה ללא מצב דחוס).
- **פריסה מומלצת**: 4 עמודות × 2 שורות = 8 קלפים בעמוד.
- **פורמט קובץ**: HTML מותאם להדפסה ו/או PDF עם יחידות מידה במילימטרים.

## מבנה מוצע ל־HTML/CSS

```html
<section class="print-page">
  <h2 class="print-title">סט קלפים לדוגמה</h2>
  <div class="print-layout">
    <article class="print-card">
      <header class="card-meta">
        <span class="meta-id">#001</span>
        <span class="meta-author">מאת עוזי</span>
        <span class="meta-date">י״א בחשוון תשפ״ו</span>
      </header>
      <div class="card-body">
        <h3>כותרת הקלף</h3>
        <div class="card-section">
          <h4>תיאור קצר</h4>
          <p>טקסט תמציתי...</p>
        </div>
        <!-- 2–4 מקטעים נוספים -->
      </div>
      <footer class="card-footer">
        <span class="card-category">קטגוריה</span>
        <span class="card-batch">סט X · קלף Y</span>
      </footer>
    </article>
  </div>
</section>
```

```css
@page {
  size: A4 landscape;
  margin: 2mm;
}

.print-layout {
  display: grid;
  grid-template-columns: repeat(4, 70mm);
  grid-template-rows: repeat(2, 100mm);
  gap: 3mm;
  justify-content: center;
}

.print-card {
  width: 70mm;
  height: 100mm;
  border: 0.6mm solid #333;
  border-radius: 6mm;
  padding: 6mm;
}

.print-page:not(:last-of-type) {
  page-break-after: always;
}
```

## תוכן הקלפים

- כותרת קצרה (נושא/שימוש בשבת).
- טקסט תמציתי או תזכורת (ברכה, הלכה, רעיון למפגש שבת).
- אפשרות לאייקון/אימוג׳י בהתאם לתוכן.

## צעדים הבאים

1. יצירת עמוד ייעודי `printable.html` עם מבנה רשת 4×2 לכל סט.
2. הטמעת מספר סטים (1–5 עמודים) עם תוכן מדורג: פתיחה, לימוד, ילדים, משחקים ועוד.
3. בעתיד: טעינת תוכן דינמית מתוך JSON/Markdown ייעודי (`cards.json`).
4. בדיקה מעשית במדפסת, הקפדה על הדפסה ב־100% וללא התאמת קנה מידה.
5. שיקול להוספת PDF שנוצר אוטומטית באמצעות כלי build להורדה מהירה.

בהצלחה! ביצוע נכון יאפשר חוויה חינוכית ושיתופית לשולחן השבת ✨

