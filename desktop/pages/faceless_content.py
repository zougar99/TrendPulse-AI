from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class FacelessContentPage(QWidget):
    page_title = "Faceless Content"

    def __init__(self):
        super().__init__()
        self.setObjectName("facelessContentPage")
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

        title = QLabel("Faceless Content")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.niche_input = QLineEdit()
        self.niche_input.setPlaceholderText("Enter niche (e.g., tech reviews, finance tips)...")
        self.generate_btn = QPushButton("Generate Ideas")
        self.generate_btn.setObjectName("btnPrimary")
        self.generate_btn.clicked.connect(self.generate)
        input_layout.addWidget(self.niche_input)
        input_layout.addWidget(self.generate_btn)
        sl.addLayout(input_layout)

        niches_card = QFrame()
        niches_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        niches_layout = QVBoxLayout(niches_card)
        niches_layout.addWidget(QLabel("Faceless Niche Ideas"))
        self.niches_list = QListWidget()
        niches_layout.addWidget(self.niches_list)
        sl.addWidget(niches_card)

        script_card = QFrame()
        script_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        script_layout = QVBoxLayout(script_card)
        script_layout.addWidget(QLabel("Voiceover Script"))
        self.script_text = QTextEdit()
        self.script_text.setReadOnly(True)
        self.script_text.setMaximumHeight(150)
        script_layout.addWidget(self.script_text)
        sl.addWidget(script_card)

        footage_card = QFrame()
        footage_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        footage_layout = QVBoxLayout(footage_card)
        footage_layout.addWidget(QLabel("Stock Footage Ideas"))
        self.footage_list = QListWidget()
        footage_layout.addWidget(self.footage_list)
        sl.addWidget(footage_card)

        avatar_card = QFrame()
        avatar_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        avatar_layout = QVBoxLayout(avatar_card)
        avatar_layout.addWidget(QLabel("AI Avatar Concepts"))
        self.avatar_list = QListWidget()
        avatar_layout.addWidget(self.avatar_list)
        sl.addWidget(avatar_card)

        workflow_card = QFrame()
        workflow_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        workflow_layout = QVBoxLayout(workflow_card)
        workflow_layout.addWidget(QLabel("Automation Workflow"))
        self.workflow_list = QListWidget()
        workflow_layout.addWidget(self.workflow_list)
        sl.addWidget(workflow_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def generate(self):
        niche = self.niche_input.text().strip() or "tech"
        QTimer.singleShot(100, lambda: self._generate(niche))

    def _generate(self, niche):
        self.niches_list.clear()
        ideas = [
            (f"{niche} compilation (no commentary)", 85, "Low", 92),
            (f"{niche} facts and figures", 78, "Low", 88),
            (f"{niche} top 10 listicles", 72, "Medium", 80),
            (f"{niche} tutorial screencast", 90, "Low", 95),
            (f"{niche} animated explainer", 82, "Medium", 85),
        ]
        for name, prof, diff, auto in ideas:
            self.niches_list.addItem(f"{name} | Profit: {prof}% | Difficulty: {diff} | Automation: {auto}%")

        self.script_text.setText(f"[HOOK]\nDid you know the {niche} industry is changing faster than ever?\n\n[INTRO]\nWelcome to this deep dive into {niche}. In this video, we'll explore the latest trends, tools, and strategies.\n\n[BODY]\nPoint 1: The current landscape of {niche}\nPoint 2: How to leverage {niche} for growth\nPoint 3: Expert predictions for 2026\n\n[OUTRO]\nIf you found this helpful, subscribe for more {niche} content!")

        self.footage_list.clear()
        footages = [
            f"Stock footage of {niche} in action",
            f"Screen recordings of {niche} tools",
            f"Animated infographics about {niche}",
            f"B-roll of technology related to {niche}",
            f"Motion graphics explaining {niche} concepts",
            f"Time-lapse of {niche} workflow",
        ]
        for f in footages:
            self.footage_list.addItem(f)

        self.avatar_list.clear()
        avatars = [
            f"AI Avatar - Professional {niche} expert (male)",
            f"AI Avatar - Friendly {niche} educator (female)",
            f"AI Avatar - Energetic {niche} reviewer (neutral)",
            f"AI Avatar - Minimalist {niche} narrator",
        ]
        for a in avatars:
            self.avatar_list.addItem(a)

        self.workflow_list.clear()
        steps = [
            "1. Research trending topics in niche (20 min)",
            "2. Generate script using AI (10 min)",
            "3. Source stock footage and assets (30 min)",
            "4. Generate AI voiceover (15 min)",
            "5. Edit video with text overlays (45 min)",
            "6. Add background music (10 min)",
            "7. Generate thumbnail using AI (15 min)",
            "8. Schedule and publish (5 min)",
        ]
        for s in steps:
            self.workflow_list.addItem(s)
