% ============================================
% УМК «Математика строит будущее»
% Класс документа для практических работ
% Автор: Станулевич А.В., ГГКСТ
% ============================================
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{umk-matematika}[2026/01/15 v1.0 УМК Математика]

% Базовый класс
\LoadClass[12pt,a4paper]{article}

% Кодировки и языки
\RequirePackage[utf8]{inputenc}
\RequirePackage[T2A]{fontenc}
\RequirePackage[russian]{babel}

% Геометрия страницы
\RequirePackage[top=2cm, bottom=2cm, left=2.5cm, right=2cm]{geometry}

% Математика
\RequirePackage{amsmath,amssymb}

% Графика
\RequirePackage{graphicx}
\RequirePackage{tikz}
\RequirePackage{xcolor}

% Таблицы
\RequirePackage{tabularx}
\RequirePackage{booktabs}
\RequirePackage{colortbl}

% Колонтитулы
\RequirePackage{fancyhdr}
\RequirePackage{lastpage}

% Списки
\RequirePackage{enumitem}

% Гиперссылки
\RequirePackage{hyperref}
\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue
}

% -------------------------------------------
% ЦВЕТА УМК
% -------------------------------------------
\definecolor{gold}{HTML}{D4A017}
\definecolor{darkbg}{HTML}{0d1117}
\definecolor{cardbg}{HTML}{161b22}
\definecolor{textgray}{HTML}{8b949e}

% Уровни сложности
\definecolor{levelF}{HTML}{4ade80}  % Фундамент - зелёный
\definecolor{levelW}{HTML}{60a5fa}  % Стены - синий
\definecolor{levelR}{HTML}{fbbf24}  % Кровля - жёлтый

% -------------------------------------------
% КОЛОНТИТУЛЫ
% -------------------------------------------
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small УМК «Математика строит будущее» • ГГКСТ}
\fancyhead[R]{\small Станулевич А.В.}
\fancyfoot[C]{\thepage\ / \pageref{LastPage}}
\renewcommand{\headrulewidth}{1pt}
\renewcommand{\headrule}{\hbox to\headwidth{\color{gold}\leaders\hrule height 2pt\hfill}}

% -------------------------------------------
% ТИТУЛЬНАЯ СТРАНИЦА
% -------------------------------------------
\newcommand{\maketitlepage}[3]{
    \thispagestyle{empty}
    \begin{center}
        \vspace*{3cm}
        
        {\Large\bfseries Министерство образования Республики Беларусь}\\[5pt]
        {\large Гродненский государственный колледж строительных технологий}
        
        \vspace{2cm}
        
        {\Huge\bfseries\color{gold} Математика строит будущее}
        
        \vspace{1cm}
        
        {\Large\bfseries #1}
        
        \vspace{0.5cm}
        
        {\large #2}
        
        \vspace{1cm}
        
        {\normalsize #3}
        
        \vfill
        
        {\normalsize Гродно, 2026}
    \end{center}
    \newpage
}

% -------------------------------------------
% ЗАГОЛОВКИ РАЗДЕЛОВ
% -------------------------------------------
\RequirePackage{titlesec}
\titleformat{\section}
    {\Large\bfseries\color{gold}}
    {\thesection}{1em}{}
\titleformat{\subsection}
    {\large\bfseries}
    {\thesubsection}{1em}{}

% -------------------------------------------
% ОФОРМЛЕНИЕ ЗАДАЧ
% -------------------------------------------
\newenvironment{task}[2]
{
    \begin{minipage}{\textwidth}
    \textbf{Задача #1.} \textit{(#2)} \\[5pt]
}
{
    \vspace{8pt}
    \end{minipage}
}

% Плашка уровня
\newcommand{\levelbadge}[1]{
    \colorbox{#1}{\color{white}\small\bfseries\uppercase{#1}}
}

% Блок «В строительстве»
\newenvironment{builderblock}
{
    \vspace{10pt}
    \begin{center}
    \begin{minipage}{0.95\textwidth}
    \colorbox{cardbg!10}{\color{gold}\textbf{🏗️ В строительстве применяется:}}
    \vspace{5pt}
}
{
    \end{minipage}
    \end{center}
    \vspace{10pt}
}

% -------------------------------------------
% ТАБЛИЦА КРИТЕРИЕВ
% -------------------------------------------
\newcommand{\criteriatable}{
    \begin{center}
    \begin{tabular}{|c|c|c|c|}
        \hline
        \rowcolor{gold!20}
        \textbf{Уровень} & \textbf{Баллы} & \textbf{Цвет} & \textbf{Описание} \\
        \hline
        Фундамент & 1--4 & Зелёный & Базовый уровень \\
        \hline
        Стены & 5--7 & Синий & Стандартный уровень \\
        \hline
        Кровля & 8--10 & Жёлтый & Повышенный уровень \\
        \hline
    \end{tabular}
    \end{center}
}

\endinput
