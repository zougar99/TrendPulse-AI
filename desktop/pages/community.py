from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class CommunityIntelPage(QWidget):
    page_title = "Community Intel"

    def __init__(self):
        super().__init__()
        self.setObjectName("communityIntelPage")
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

        title = QLabel("Community Intel")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        heatmap_card = QFrame()
        heatmap_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        heatmap_layout = QVBoxLayout(heatmap_card)
        heatmap_layout.addWidget(QLabel("Community Interest Heatmap"))
        self.heatmap_widget = QWidget()
        self.heatmap_widget.setMinimumHeight(120)
        self.heatmap_widget.setStyleSheet("background: transparent;")
        self.heatmap_widget.paintEvent = self.paint_heatmap
        heatmap_layout.addWidget(self.heatmap_widget)
        sl.addWidget(heatmap_card)

        rising_card = QFrame()
        rising_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        rising_layout = QVBoxLayout(rising_card)
        rising_layout.addWidget(QLabel("Rising Keywords"))
        self.rising_list = QListWidget()
        rising_layout.addWidget(self.rising_list)
        sl.addWidget(rising_card)

        hidden_card = QFrame()
        hidden_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        hidden_layout = QVBoxLayout(hidden_card)
        hidden_layout.addWidget(QLabel("Hidden Opportunities"))
        self.hidden_list = QListWidget()
        hidden_layout.addWidget(self.hidden_list)
        sl.addWidget(hidden_card)

        niche_card = QFrame()
        niche_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        niche_layout = QVBoxLayout(niche_card)
        niche_layout.addWidget(QLabel("Niche Acceleration"))
        self.niche_list = QListWidget()
        niche_layout.addWidget(self.niche_list)
        sl.addWidget(niche_card)

        creator_card = QFrame()
        creator_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        creator_layout = QVBoxLayout(creator_card)
        creator_layout.addWidget(QLabel("Emerging Creators"))
        self.creator_list = QListWidget()
        creator_layout.addWidget(self.creator_list)
        sl.addWidget(creator_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.load_demo_data()

    def paint_heatmap(self, event):
        p = QPainter(self.heatmap_widget)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.heatmap_widget.width() - 20
        h = self.heatmap_widget.height() - 20
        cols, rows = 10, 5
        cw = w / cols
        rh = h / rows
        for row in range(rows):
            for col in range(cols):
                x = 10 + col * cw
                y = 10 + row * rh
                val = random.randint(0, 100)
                intensity = val / 100.0
                r = int(0 + 138 * intensity)
                g = int(92 + 100 * (1 - intensity))
                b = int(255 - 200 * intensity)
                color = QColor(min(255, r), min(255, g), min(255, b))
                p.setBrush(color)
                p.setPen(Qt.PenStyle.NoPen)
                p.drawRoundedRect(QRectF(x + 1, y + 1, cw - 2, rh - 2), 2, 2)

    def load_demo_data(self):
        rising = [
            ("AI coding assistants", "↑", 340),
            ("Quantum computing basics", "↑", 180),
            ("Edge AI devices", "↑", 120),
            ("Rust programming", "↑", 95),
            ("Web3 development", "↑", 78),
        ]
        for kw, direction, growth in rising:
            self.rising_list.addItem(f"{direction} {kw} - {growth}% growth")

        hidden = [
            ("AI ethics consulting", 92, "Low"),
            ("No-code AI tools", 88, "Low"),
            ("Digital twin technology", 85, "Low"),
            ("Prompt engineering", 82, "Medium"),
            ("AI art generation", 78, "Medium"),
        ]
        for niche, score, comp in hidden:
            self.hidden_list.addItem(f"{niche} - Score: {score}/100 - Competition: {comp}")

        niches = [
            ("AI Education", 72),
            ("Crypto Trading", 65),
            ("Health Tech", 58),
            ("Green Energy", 52),
            ("EdTech", 48),
        ]
        for name, acc in niches:
            self.niche_list.addItem(f"{name} - Acceleration: {acc}%")

        creators = [
            ("TechWithAnna", "1.2M", 340),
            ("CodeMaster", "850K", 280),
            ("AIDaily", "620K", 220),
            ("DevTips", "450K", 190),
            ("FutureTech", "380K", 160),
        ]
        for name, followers, growth in creators:
            self.creator_list.addItem(f"{name} - {followers} followers - {growth}% growth")
