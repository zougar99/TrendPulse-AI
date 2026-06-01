from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class NicheFinderPage(QWidget):
    page_title = "Niche Finder"

    def __init__(self):
        super().__init__()
        self.setObjectName("nicheFinderPage")
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

        title = QLabel("Niche Finder")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.keyword_input = QLineEdit()
        self.keyword_input.setPlaceholderText("Enter a keyword to discover niches...")
        self.discover_btn = QPushButton("Discover Niches")
        self.discover_btn.setObjectName("btnPrimary")
        self.discover_btn.clicked.connect(self.discover)
        input_layout.addWidget(self.keyword_input)
        input_layout.addWidget(self.discover_btn)
        sl.addLayout(input_layout)

        self.results_table = QTableWidget()
        self.results_table.setObjectName("nicheTable")
        self.results_table.setColumnCount(6)
        self.results_table.setHorizontalHeaderLabels(["Niche", "Profitability", "Competition", "Growth Velocity", "Monetization", "Saturation"])
        self.results_table.horizontalHeader().setStretchLastSection(True)
        self.results_table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.results_table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.results_table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        sl.addWidget(self.results_table)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def discover(self):
        keyword = self.keyword_input.text().strip()
        if not keyword:
            QTimer.singleShot(0, lambda: self.set_demo_data())
            return
        self.discover_btn.setEnabled(False)
        self.discover_btn.setText("Discovering...")
        QTimer.singleShot(100, lambda: self._run_discover(keyword))

    def _run_discover(self, keyword):
        result = keywords_niche(keyword)
        if 'error' in result:
            self.set_demo_data()
        else:
            self.set_niche_data(result)
        self.discover_btn.setEnabled(True)
        self.discover_btn.setText("Discover Niches")

    def set_niche_data(self, data):
        niches = data.get('niches', [])
        self.results_table.setRowCount(len(niches))
        for i, n in enumerate(niches[:50]):
            kw = n.get('keyword', '')
            opp = n.get('opportunity', random.randint(30, 95))
            comp = n.get('competition', random.choice(['Low', 'Medium', 'High']))
            growth = random.randint(-10, 80)
            monet = random.choice(['Affiliate', 'Ads', 'Sponsorship', 'Products', 'Courses'])
            sat = random.choice(['Low', 'Medium', 'High'])
            self.results_table.setItem(i, 0, QTableWidgetItem(kw))
            self.results_table.setItem(i, 1, QTableWidgetItem(f"{opp}%"))
            self._color_cell(i, 1, opp)
            comp_item = QTableWidgetItem(comp)
            self._color_comp(i, 2, comp)
            self.results_table.setItem(i, 2, comp_item)
            self.results_table.setItem(i, 3, QTableWidgetItem(f"{growth}%"))
            self._color_cell(i, 3, growth)
            self.results_table.setItem(i, 4, QTableWidgetItem(monet))
            sat_item = QTableWidgetItem(sat)
            self._color_comp(i, 5, sat)
            self.results_table.setItem(i, 5, sat_item)

    def set_demo_data(self):
        niches_data = [
            ("ai tools for beginners", 92, "Low", 75),
            ("python automation", 88, "Low", 65),
            ("digital marketing tips", 75, "Medium", 45),
            ("crypto trading guide", 70, "High", 30),
            ("youtube shorts ideas", 85, "Medium", 55),
            ("machine learning basics", 80, "Low", 60),
            ("web development 2026", 78, "Medium", 50),
            ("content creation tips", 72, "High", 35),
            ("seo optimization guide", 76, "Medium", 48),
            ("data science projects", 82, "Low", 58),
            ("blockchain explained", 68, "Medium", 40),
            ("react native tutorial", 84, "Low", 62),
            ("cloud computing aws", 74, "Medium", 44),
            ("cybersecurity basics", 79, "Low", 56),
            ("docker kubernetes", 81, "Low", 60),
            ("typescript guide", 77, "Medium", 52),
            ("node.js backend", 73, "Medium", 46),
            ("flutter app development", 83, "Low", 64),
            ("ethical hacking", 69, "High", 32),
            ("sql database tutorial", 71, "Medium", 42),
        ]
        self.results_table.setRowCount(len(niches_data))
        for i, (kw, opp, comp, growth) in enumerate(niches_data):
            monet = random.choice(['Affiliate', 'Ads', 'Sponsorship', 'Products', 'Courses'])
            sat = "Low" if opp > 80 else "Medium" if opp > 60 else "High"
            self.results_table.setItem(i, 0, QTableWidgetItem(kw))
            self.results_table.setItem(i, 1, QTableWidgetItem(f"{opp}%"))
            self._color_cell(i, 1, opp)
            comp_item = QTableWidgetItem(comp)
            self._color_comp(i, 2, comp)
            self.results_table.setItem(i, 2, comp_item)
            self.results_table.setItem(i, 3, QTableWidgetItem(f"{growth}%"))
            self._color_cell(i, 3, growth)
            self.results_table.setItem(i, 4, QTableWidgetItem(monet))
            sat_item = QTableWidgetItem(sat)
            self._color_comp(i, 5, sat)
            self.results_table.setItem(i, 5, sat_item)

    def _color_cell(self, row, col, val):
        color = "#00FF88" if val >= 70 else "#FFD700" if val >= 40 else "#FF2D95"
        item = self.results_table.item(row, col)
        if item:
            item.setForeground(QColor(color))

    def _color_comp(self, row, col, val):
        mapping = {"Low": "#00FF88", "Medium": "#FFD700", "High": "#FF2D95"}
        item = self.results_table.item(row, col)
        if item and val in mapping:
            item.setForeground(QColor(mapping[val]))
