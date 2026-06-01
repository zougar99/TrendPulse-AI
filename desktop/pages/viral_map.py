from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ViralScoreMapPage(QWidget):
    page_title = "Viral Score Map"

    def __init__(self):
        super().__init__()
        self.setObjectName("viralScoreMapPage")
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

        header = QHBoxLayout()
        title = QLabel("Viral Score Map")
        title.setObjectName("titleLabel")
        header.addWidget(title)
        header.addStretch()
        self.region_combo = QComboBox()
        regions = ["US", "MA", "FR", "GB", "DE", "IN", "JP", "BR", "CA", "AU"]
        self.region_combo.addItems(regions)
        self.region_combo.currentTextChanged.connect(self.load_data)
        header.addWidget(QLabel("Region:"))
        header.addWidget(self.region_combo)
        sl.addLayout(header)

        stats_grid = QGridLayout()
        stats_grid.setSpacing(10)
        self.stat_cards = {}
        countries = ["United States", "Morocco", "France", "United Kingdom", "Germany", "India", "Japan"]
        for i, country in enumerate(countries):
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 14px; }")
            cl = QVBoxLayout(card)
            cn = QLabel(country)
            cn.setStyleSheet("font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8);")
            cl.addWidget(cn)
            ts = QLabel(f"Trend Score: --")
            ts.setObjectName("mutedText")
            cl.addWidget(ts)
            gv = QLabel(f"Growth: --")
            gv.setObjectName("mutedText")
            cl.addWidget(gv)
            vo = QLabel(f"Volume: --")
            vo.setObjectName("mutedText")
            cl.addWidget(vo)
            self.stat_cards[country] = (ts, gv, vo)
            stats_grid.addWidget(card, i // 4, i % 4)
        sl.addLayout(stats_grid)

        demo_card = QFrame()
        demo_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        demo_layout = QVBoxLayout(demo_card)
        d1 = QLabel("Demographics: Age Targeting")
        d1.setObjectName("cardTitle")
        demo_layout.addWidget(d1)
        self.age_bars = {}
        for age in ["13-17", "18-24", "25-34", "35-44", "45+"]:
            hl = QHBoxLayout()
            lbl = QLabel(age)
            lbl.setFixedWidth(50)
            lbl.setStyleSheet("font-size: 11px; color: rgba(255,255,255,0.6);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            bar.setStyleSheet("QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 8px; } QProgressBar::chunk { background: #00BFFF; border-radius: 3px; }")
            vl = QLabel("0%")
            vl.setFixedWidth(35)
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            self.age_bars[age] = (bar, vl)
            hl.addWidget(lbl)
            hl.addWidget(bar)
            hl.addWidget(vl)
            demo_layout.addLayout(hl)
        sl.addWidget(demo_card)

        device_card = QFrame()
        device_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        device_layout = QVBoxLayout(device_card)
        d2 = QLabel("Device Analytics")
        d2.setObjectName("cardTitle")
        device_layout.addWidget(d2)
        self.device_bars = {}
        for dev in ["Mobile", "Desktop", "Tablet"]:
            hl = QHBoxLayout()
            lbl = QLabel(dev)
            lbl.setFixedWidth(70)
            lbl.setStyleSheet("font-size: 11px; color: rgba(255,255,255,0.6);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            color = "#00BFFF" if dev == "Mobile" else "#8A5CFF" if dev == "Desktop" else "#FF2D95"
            bar.setStyleSheet(f"QProgressBar {{ background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 8px; }} QProgressBar::chunk {{ background: {color}; border-radius: 3px; }}")
            vl = QLabel("0%")
            vl.setFixedWidth(35)
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            self.device_bars[dev] = (bar, vl)
            hl.addWidget(lbl)
            hl.addWidget(bar)
            hl.addWidget(vl)
            device_layout.addLayout(hl)
        sl.addWidget(device_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.load_data()

    def load_data(self):
        region = self.region_combo.currentText()
        for country, (ts, gv, vo) in self.stat_cards.items():
            ts.setText(f"Trend Score: {random.randint(30, 95)}")
            gv.setText(f"Growth: {random.randint(-20, 80)}%")
            vo.setText(f"Volume: {random.randint(100, 90000):,}")
        for age, (bar, vl) in self.age_bars.items():
            val = random.randint(10, 90)
            bar.setValue(val)
            vl.setText(f"{val}%")
        for dev, (bar, vl) in self.device_bars.items():
            val = random.randint(10, 90)
            bar.setValue(val)
            vl.setText(f"{val}%")
