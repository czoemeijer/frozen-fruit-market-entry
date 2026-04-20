\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{thesis}[2026/04/19 v1.0 Diplomová práce – Panevropská univerzita]

\RequirePackage{iftex}

\newif\if@print \@printfalse
\DeclareOption{print}{\@printtrue}

\ProcessOptions\relax

% Rozložení stránky
\if@print
  \LoadClass[11pt,twoside,a4paper]{book}
  \RequirePackage[inner=3cm,outer=2cm,top=3cm,bottom=2cm]{geometry}
\else
  \LoadClass[11pt,oneside,a4paper]{book}
  \RequirePackage[margin=2cm,left=3cm,top=3cm,bottom=2cm]{geometry}
\fi

\RequirePackage{graphicx}
\RequirePackage{tabularx}

% LuaLaTeX / XeLaTeX: nativní UTF-8 + fonty
\ifPDFTeX
  % pdfTeX – uživatel musí načíst inputenc/fontenc sám
\else
  \RequirePackage{fontspec}
  \defaultfontfeatures{Ligatures=TeX}
\fi

\RequirePackage{microtype}

% ============================================================================
% Výchozí hodnoty – Panevropská univerzita
% ============================================================================
\newcommand\University{Panevropská univerzita, a.s.}
\newcommand\Faculty{Fakulta podnikání a práva}
\newcommand\Department{}

\newcommand\ThesisType{Diplomová práce}
\newcommand\StudyProgram{Marketingové komunikace}
\newcommand\StudyBranch{Marketingové komunikace}

% Přepisy
\newcommand{\university}[1]{\renewcommand\University{#1}}
\newcommand{\faculty}[1]{\renewcommand\Faculty{#1}}
\newcommand{\department}[1]{\renewcommand\Department{#1}}
\newcommand{\thesistype}[1]{\renewcommand\ThesisType{#1}}
\newcommand{\studyprogram}[1]{\renewcommand\StudyProgram{#1}}
\newcommand{\studybranch}[1]{\renewcommand\StudyBranch{#1}}

% Vedoucí práce
\def \@supervisor{Neznámý}
\newcommand{\supervisor}[1]{\def\@supervisor{#1}}

\def \@supervisorAffiliation{Neznámý}
\newcommand{\supervisorAffiliation}[1]{\def\@supervisorAffiliation{#1}}

\def \@placeyear{Praha 2026}
\newcommand{\placeyear}[1]{\def\@placeyear{#1}}

% Pomocné příkazy
\newcommand{\figref}[1]{Obrázek~\ref{#1}}
\newcommand{\tabref}[1]{Tabulka~\ref{#1}}
\newcommand{\secref}[1]{Kapitola~\ref{#1}}

% ============================================================================
% Titulní strana
% ============================================================================
\renewcommand\maketitle{%
  \@fullthesis
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\@maketitle\relax
  \global\let\@thanks\@empty
  \global\let\@author\@empty
  \global\let\@date\@empty
  \global\let\@title\@empty
  \global\let\title\relax
  \global\let\author\relax
  \global\let\date\relax
  \global\let\and\relax
}

\def\@fullthesis{%
  \frontmatter
  \begin{center}
    {\LARGE\bfseries
    \University}\\[3mm]
    {\Large\sffamily
    \Faculty}\\[2mm]
    \ifx\Department\empty\else
      {\large\sffamily
      \Department}\\[2mm]
    \fi
    \vspace{10mm}
    \IfFileExists{images/symbol-panevropska-univerzita-300x300.png}{%
      \includegraphics[width=45mm]{images/symbol-panevropska-univerzita-300x300.png}%
    }{}
    \vspace{15mm}

    {\LARGE\bfseries\@title}\\[8mm]
    {\Large\sffamily \ThesisType}\\[10mm]
    \@placeyear
    {\large
      Studijní program: \StudyProgram\\[3mm]
      Vedoucí práce: \@supervisor\\
    }
    \vfill
    \@placeyear\\
  \end{center}
  \thispagestyle{empty}

  % Strana 2 – copyright
  \newpage
  \rule{0pt}{0pt}
  \vfill
  \begin{description}
    \item[Vedoucí práce:]
    \@supervisor\\
    \@supervisorAffiliation
  \end{description}
  Copyright {\copyright} {\@date} {\@author}
}

% ============================================================================
% Bibliografie – ISO 690 (číslované odkazy)
% ============================================================================
\RequirePackage[style=numeric,sorting=none,backend=biber]{biblatex}

\DeclareBibliographyCategory{fullcited}
\newcommand{\bibentry}[1]{\fullcite{#1}\addtocategory{fullcited}{#1}}

\RequirePackage[nottoc]{tocbibind}
\RequirePackage{setspace}

% Hypertextové odkazy
\RequirePackage{xcolor}
\RequirePackage{hyperref}
\hypersetup{%
  colorlinks=true,
  citecolor=blue!60!black,
  linkcolor=black,
  urlcolor=blue!60!black,
  hypertexnames=false
}

% PDF metadata
\makeatletter
\AtBeginDocument{%
  \hypersetup{%
    pdftitle={\@title},
    pdfauthor={\@author},
    pdfsubject={\ThesisType},
  }%
}
\makeatother
