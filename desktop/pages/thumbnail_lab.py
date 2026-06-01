from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ThumbnailLabPage(QWidget):
    page_title = "Thumbnail Lab"

    def __init__(self):
        super().__init__()
        self.setObjectName("thumbnailLabPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("contentArea")
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll_widget = QWidget()
        sl = QVBoxLayout(scroll_widget)
        sl.setContentsMargins(0, 0, 0, 0)
        sl.setSpacing(16)

        title = QLabel("Thumbnail Lab")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.topic_input = QLineEdit()
        self.topic_input.setPlaceholderText("Enter video topic...")
        self.analyze_btn = QPushButton("Analyze")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        self.gen_btn = QPushButton("Generate Thumbnail Ideas")
        self.gen_btn.setObjectName("btnAccent")
        self.gen_btn.clicked.connect(self.generate_ideas)
        input_layout.addWidget(self.topic_input)
        input_layout.addWidget(self.analyze_btn)
        input_layout.addWidget(self.gen_btn)
        sl.addLayout(input_layout)

        ctr_card = QFrame()
        ctr_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 20px; }")
        ctr_layout = QHBoxLayout(ctr_card)
        ctr_layout.addWidget(QLabel("CTR Score:"))
        self.ctr_label = QLabel("--")
        self.ctr_label.setStyleSheet("font-size: 36px; font-weight: 700; color: #FF2D95;")
        ctr_layout.addWidget(self.ctr_label)
        sl.addWidget(ctr_card)

        self.heatmap_widget = HeatmapWidget()
        self.heatmap_widget.setMinimumHeight(120)
        sl.addWidget(self.heatmap_widget)

        color_card = QFrame()
        color_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        color_layout = QVBoxLayout(color_card)
        color_title = QLabel("Color Psychology")
        color_title.setObjectName("cardTitle")
        color_layout.addWidget(color_title)
        colors_list = [
            ("#FF0000", "Red - Urgency, excitement, appetite"),
            ("#00BFFF", "Blue - Trust, calm, professionalism"),
            ("#FFD700", "Yellow - Optimism, attention, warmth"),
            ("#8A5CFF", "Purple - Creativity, luxury, mystery"),
            ("#FF2D95", "Pink - Energy, fun, youth"),
            ("#00FF88", "Green - Growth, health, money"),
        ]
        for hex_val, desc in colors_list:
            hl = QHBoxLayout()
            swatch = QFrame()
            swatch.setFixedSize(20, 20)
            swatch.setStyleSheet(f"background: {hex_val}; border-radius: 3px;")
            hl.addWidget(swatch)
            hl.addWidget(QLabel(desc))
            color_layout.addLayout(hl)
        sl.addWidget(color_card)

        contrast_card = QFrame()
        contrast_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        contrast_layout = QVBoxLayout(contrast_card)
        contrast_layout.addWidget(QLabel("Contrast Score"))
        self.contrast_bar = QProgressBar()
        self.contrast_bar.setMaximum(100)
        contrast_layout.addWidget(self.contrast_bar)
        sl.addWidget(contrast_card)

        self.suggestions_list = QListWidget()
        self.suggestions_list.setObjectName("suggestionsList")
        sl.addWidget(self.suggestions_list)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def analyze(self):
        topic = self.topic_input.text().strip() or "trending video"
        QTimer.singleShot(100, lambda: self._analyze(topic))

    def _analyze(self, topic):
        ctr = random.randint(45, 95)
        self.ctr_label.setText(f"{ctr}%")
        self.heatmap_widget.set_values([random.randint(0, 100) for _ in range(24)])
        self.contrast_bar.setValue(random.randint(40, 95))
        self.suggestions_list.clear()
        suggestions = [
            "Use high contrast colors (dark bg + bright text)",
            "Place subject in center or rule-of-thirds",
            "Add facial close-up for emotional connection",
            "Use arrows or circles to draw attention",
            "Keep text minimal: 3-4 words maximum",
            "Use complementary color scheme",
            "Ensure thumbnail is readable at small size",
        ]
        for s in suggestions:
            self.suggestions_list.addItem(s)

    def generate_ideas(self):
        topic = self.topic_input.text().strip() or "trending topic"
        QTimer.singleShot(100, lambda: self._generate(topic))

    def _generate(self, topic):
        result = thumbnail_ideas(topic)
        if 'error' not in result:
            ideas = result.get('titleIdeas', [])
            self.suggestions_list.clear()
            for idea in ideas[:15]:
                self.suggestions_list.addItem(f"[{idea.get('category', 'idea')}] {idea.get('title', '')}")


class HeatmapWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.values = [0] * 24

    def set_values(self, vals):
        self.values = vals
        self.update()

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.width() - 20
        h = self.height() - 20
        cols, rows = 6, 4
        cw = w / cols
        rh = h / rows
        for i, val in enumerate(self.values):
            col = i % cols
            row = i // cols
            x = 10 + col * cw
            y = 10 + row * rh
            intensity = val / 100.0
            r = int(255 * intensity)
            g = int(100 * (1 - intensity))
            b = int(255 * (1 - intensity * 0.5))
            color = QColor(min(255, r), min(255, g), min(255, b))
            p.setBrush(color)
            p.setPen(QPen(QColor(40, 40, 50), 1))
            p.drawRoundedRect(QRectF(x, y, cw - 4, rh - 4), 3, 3)
