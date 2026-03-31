"""
Seed script — run once to populate the database.
Usage: python seed_data.py
"""
import json
from database import engine, SessionLocal
from models import Base, Company, Role, Skill, InterviewQuestion

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── COMPANIES ──────────────────────────────────────────────────────────────────
COMPANIES = [
  {"name":"Google","industry":"Technology","size":"180,000+","headquarters":"Mountain View, CA","description":"Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, and AI.","culture":"Innovation-driven, open culture. 20% time for personal projects. Strong focus on data-driven decisions.","tech_stack":json.dumps(["Python","Go","C++","Java","Kotlin","JavaScript","TensorFlow","Kubernetes","BigQuery","Spanner"]),"glassdoor_rating":4.4,"website":"https://google.com","logo_color":"#4285F4"},
  {"name":"Amazon","industry":"E-commerce / Cloud","size":"1,500,000+","headquarters":"Seattle, WA","description":"Amazon is a global technology and e-commerce company, home to AWS—the world's leading cloud platform.","culture":"Leadership Principles drive everything. High bar for ownership and results. Fast-paced and data-driven.","tech_stack":json.dumps(["Java","Python","AWS","DynamoDB","React","Node.js","Scala","Kotlin","Ruby"]),"glassdoor_rating":3.9,"website":"https://amazon.com","logo_color":"#FF9900"},
  {"name":"Microsoft","industry":"Technology","size":"220,000+","headquarters":"Redmond, WA","description":"Microsoft is a global leader in software, cloud services (Azure), and productivity tools including Office 365 and GitHub.","culture":"Growth mindset culture. Inclusive and collaborative. Strong work-life balance initiatives.","tech_stack":json.dumps(["C#",".NET","TypeScript","Azure","Python","PowerShell","React","Rust","Go"]),"glassdoor_rating":4.3,"website":"https://microsoft.com","logo_color":"#00A4EF"},
  {"name":"Meta","industry":"Social Media / Technology","size":"80,000+","headquarters":"Menlo Park, CA","description":"Meta Platforms builds technologies for connection including Facebook, Instagram, WhatsApp, and the metaverse.","culture":"Move fast. Bold bets on the future. Competitive and high-performance environment.","tech_stack":json.dumps(["React","Hack","Python","C++","GraphQL","Cassandra","PyTorch","React Native"]),"glassdoor_rating":4.2,"website":"https://meta.com","logo_color":"#1877F2"},
  {"name":"Apple","industry":"Technology / Consumer Electronics","size":"160,000+","headquarters":"Cupertino, CA","description":"Apple designs and sells consumer electronics, software, and online services. Known for premium hardware and ecosystem.","culture":"Secretive, detail-obsessed. High standards for quality and user experience. Collaborative but private.","tech_stack":json.dumps(["Swift","Objective-C","Python","C++","Metal","CoreML","Xcode","ARKit"]),"glassdoor_rating":4.2,"website":"https://apple.com","logo_color":"#555555"},
  {"name":"Netflix","industry":"Entertainment / Streaming","size":"13,000+","headquarters":"Los Gatos, CA","description":"Netflix is the world's leading streaming entertainment service with 260M+ subscribers.","culture":"Freedom and responsibility. High talent density. No formal vacation policy. Radical transparency.","tech_stack":json.dumps(["Java","Python","Node.js","AWS","Cassandra","Kafka","Zuul","Chaos Monkey","React"]),"glassdoor_rating":4.2,"website":"https://netflix.com","logo_color":"#E50914"},
  {"name":"Spotify","industry":"Music / Streaming","size":"9,000+","headquarters":"Stockholm, Sweden","description":"Spotify is the world's most popular audio streaming platform with 600M+ users and 230M+ subscribers.","culture":"Agile squads and chapters model. Autonomy and trust. Work-life balance focused.","tech_stack":json.dumps(["Java","Python","Kotlin","GCP","Backstage","Kafka","React","Luigi"]),"glassdoor_rating":4.4,"website":"https://spotify.com","logo_color":"#1DB954"},
  {"name":"Uber","industry":"Transportation / Technology","size":"32,000+","headquarters":"San Francisco, CA","description":"Uber is a tech company that operates ride-hailing, food delivery (Uber Eats), and freight platforms globally.","culture":"Customer obsession. Ownership mentality. Fast execution. Diverse global team.","tech_stack":json.dumps(["Go","Java","Python","Node.js","Kafka","MySQL","Redis","iOS","Android"]),"glassdoor_rating":3.9,"website":"https://uber.com","logo_color":"#000000"},
  {"name":"Airbnb","industry":"Travel / Technology","size":"6,000+","headquarters":"San Francisco, CA","description":"Airbnb is an online marketplace for short and long-term homestays and experiences.","culture":"Belonging and connection. Strong design culture. Mission-driven. Flexible remote work.","tech_stack":json.dumps(["React","Ruby on Rails","Java","Python","Airflow","Druid","MySQL","AWS"]),"glassdoor_rating":4.2,"website":"https://airbnb.com","logo_color":"#FF5A5F"},
  {"name":"LinkedIn","industry":"Professional Networking","size":"20,000+","headquarters":"Sunnyvale, CA","description":"LinkedIn is the world's largest professional networking platform owned by Microsoft.","culture":"Transforming lives. Inclusive culture. InDay monthly for personal development.","tech_stack":json.dumps(["Java","Scala","Python","Kafka","Espresso","Hadoop","React","Kubernetes"]),"glassdoor_rating":4.3,"website":"https://linkedin.com","logo_color":"#0A66C2"},
  {"name":"Salesforce","industry":"CRM / Cloud","size":"70,000+","headquarters":"San Francisco, CA","description":"Salesforce is the world's #1 CRM platform, enabling businesses to connect with customers.","culture":"Ohana culture. 1-1-1 philanthropic model. Inclusive and purpose-driven.","tech_stack":json.dumps(["Apex","Java","JavaScript","LWC","Heroku","Tableau","MuleSoft","Python"]),"glassdoor_rating":4.2,"website":"https://salesforce.com","logo_color":"#00A1E0"},
  {"name":"Nvidia","industry":"Semiconductors / AI","size":"30,000+","headquarters":"Santa Clara, CA","description":"Nvidia designs GPUs and AI chips that power modern machine learning, gaming, and autonomous vehicles.","culture":"Intellectual curiosity. High performance. Engineering excellence. Innovation-first.","tech_stack":json.dumps(["CUDA","C++","Python","TensorRT","PyTorch","TensorFlow","Triton","JAX"]),"glassdoor_rating":4.3,"website":"https://nvidia.com","logo_color":"#76B900"},
  {"name":"TCS","industry":"IT Services","size":"600,000+","headquarters":"Mumbai, India","description":"Tata Consultancy Services is India's largest IT services company, serving global clients across industries.","culture":"Process-driven. Large delivery organization. Emphasis on certifications and upskilling.","tech_stack":json.dumps(["Java",".NET","SAP","Oracle","Python","AWS","Azure","React","Angular"]),"glassdoor_rating":3.8,"website":"https://tcs.com","logo_color":"#1B3D7B"},
  {"name":"Infosys","industry":"IT Services","size":"340,000+","headquarters":"Bengaluru, India","description":"Infosys is a global leader in next-generation digital services and consulting.","culture":"Learning culture. Frugality. Strong training program (Mysore campus). Client-first.","tech_stack":json.dumps(["Java","Python",".NET","AWS","Azure","GCP","React","Angular","SAP"]),"glassdoor_rating":3.9,"website":"https://infosys.com","logo_color":"#007CC3"},
  {"name":"Wipro","industry":"IT Services","size":"250,000+","headquarters":"Bengaluru, India","description":"Wipro is a leading global information technology, consulting, and business process services company.","culture":"Spirit of Wipro. Customer focus. Integrity. Diversity and inclusion.","tech_stack":json.dumps(["Java","Python","C#","Azure","AWS","React","Angular","Salesforce","SAP"]),"glassdoor_rating":3.7,"website":"https://wipro.com","logo_color":"#341C5C"},
  {"name":"Accenture","industry":"Consulting / Technology","size":"750,000+","headquarters":"Dublin, Ireland","description":"Accenture is a global professional services company with capabilities in strategy, digital, technology, and operations.","culture":"Inclusion and diversity. Innovation. Client-focused. Global scale with local presence.","tech_stack":json.dumps(["Java","Python","Azure","AWS","SAP","Salesforce","React","Node.js","ML/AI"]),"glassdoor_rating":3.9,"website":"https://accenture.com","logo_color":"#A100FF"},
  {"name":"Stripe","industry":"Fintech / Payments","size":"8,000+","headquarters":"San Francisco, CA","description":"Stripe is a technology company that builds economic infrastructure for the internet — powering payments for millions of businesses.","culture":"Thoughtful and detailed. High ownership. Writing culture. Hiring bar is extremely high.","tech_stack":json.dumps(["Ruby","Java","Go","JavaScript","React","MySQL","Redis","AWS"]),"glassdoor_rating":4.4,"website":"https://stripe.com","logo_color":"#635BFF"},
  {"name":"Adobe","industry":"Software / Creative","size":"30,000+","headquarters":"San Jose, CA","description":"Adobe is a software company known for Creative Cloud (Photoshop, Illustrator) and Document Cloud (Acrobat).","culture":"Creativity for all. Inclusive culture. Check-In (no formal reviews). Remote-friendly.","tech_stack":json.dumps(["C++","Java","JavaScript","Python","React","AWS","Kubernetes","GraphQL"]),"glassdoor_rating":4.3,"website":"https://adobe.com","logo_color":"#FF0000"},
  {"name":"Oracle","industry":"Database / Cloud","size":"140,000+","headquarters":"Austin, TX","description":"Oracle is a global technology company known for its database systems and enterprise cloud applications.","culture":"Competitive sales culture. Technical excellence. Strong on-premises to cloud transition.","tech_stack":json.dumps(["Java","PL/SQL","Oracle DB","OCI","Python","Node.js","Kubernetes","Terraform"]),"glassdoor_rating":3.8,"website":"https://oracle.com","logo_color":"#F80000"},
  {"name":"IBM","industry":"Technology / Consulting","size":"280,000+","headquarters":"Armonk, NY","description":"IBM is a century-old technology and consulting company focused on hybrid cloud, AI (Watson), and enterprise services.","culture":"Think. Long-term focused. Reinvention culture. Strong research division.","tech_stack":json.dumps(["Java","Python","Go","IBM Cloud","OpenShift","Kubernetes","Watson AI","COBOL"]),"glassdoor_rating":3.9,"website":"https://ibm.com","logo_color":"#006699"},
]

# ── ROLES ──────────────────────────────────────────────────────────────────────
ROLES = [
  {"title":"Frontend Developer","description":"Build responsive, performant user interfaces using modern web frameworks.","level":"Mid"},
  {"title":"Backend Developer","description":"Design and build scalable server-side applications and APIs.","level":"Mid"},
  {"title":"Full Stack Developer","description":"End-to-end development across frontend and backend systems.","level":"Mid"},
  {"title":"Data Scientist","description":"Analyze complex datasets and build predictive models to derive business insights.","level":"Mid"},
  {"title":"ML Engineer","description":"Build, train, and deploy machine learning models into production systems.","level":"Mid"},
  {"title":"DevOps Engineer","description":"Automate infrastructure, CI/CD pipelines, and maintain cloud systems.","level":"Mid"},
  {"title":"Cloud Architect","description":"Design and oversee cloud infrastructure strategy, security, and scalability.","level":"Senior"},
  {"title":"Mobile Developer (iOS/Android)","description":"Build native or cross-platform mobile applications for iOS and Android.","level":"Mid"},
  {"title":"Product Manager","description":"Define product strategy, roadmap, and work with cross-functional teams to ship features.","level":"Mid"},
  {"title":"UI/UX Designer","description":"Design user-centered interfaces and experiences through research, wireframes, and prototypes.","level":"Mid"},
  {"title":"QA Engineer","description":"Ensure software quality through manual and automated testing strategies.","level":"Mid"},
  {"title":"Cybersecurity Engineer","description":"Protect systems and data from threats through security architecture and monitoring.","level":"Mid"},
  {"title":"Blockchain Developer","description":"Build decentralized applications and smart contracts on blockchain platforms.","level":"Mid"},
  {"title":"Game Developer","description":"Design and develop video games for PC, console, or mobile platforms.","level":"Mid"},
]

# ── SKILLS PER ROLE ────────────────────────────────────────────────────────────
ROLE_SKILLS = {
  "Frontend Developer": [
    {"name":"React.js","category":"Frontend Framework","importance":"Critical","course_title":"React - The Complete Guide 2024","course_provider":"Udemy","course_url":"https://www.udemy.com/course/react-the-complete-guide-incl-redux/","course_price":"$14.99"},
    {"name":"TypeScript","category":"Language","importance":"Critical","course_title":"Understanding TypeScript","course_provider":"Udemy","course_url":"https://www.udemy.com/course/understanding-typescript/","course_price":"$14.99"},
    {"name":"JavaScript (ES6+)","category":"Language","importance":"Critical","course_title":"The Complete JavaScript Course","course_provider":"Udemy","course_url":"https://www.udemy.com/course/the-complete-javascript-course/","course_price":"$14.99"},
    {"name":"HTML5 & CSS3","category":"Core Web","importance":"Critical","course_title":"HTML and CSS Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/the-html-and-css-bootcamp/","course_price":"$12.99"},
    {"name":"Next.js","category":"Framework","importance":"High","course_title":"Next.js & React - The Complete Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/nextjs-react-the-complete-guide/","course_price":"$14.99"},
    {"name":"State Management (Redux/Zustand)","category":"Frontend","importance":"High","course_title":"Redux Toolkit Complete Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/redux-toolkit-complete-guide/","course_price":"$12.99"},
    {"name":"REST APIs","category":"Integration","importance":"High","course_title":"REST API Design, Development & Management","course_provider":"Udemy","course_url":"https://www.udemy.com/course/rest-api/","course_price":"$12.99"},
    {"name":"GraphQL","category":"API","importance":"Medium","course_title":"GraphQL with React: The Complete Developers Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/graphql-with-react-course/","course_price":"$12.99"},
    {"name":"Responsive Design","category":"CSS","importance":"High","course_title":"Advanced CSS and Sass","course_provider":"Udemy","course_url":"https://www.udemy.com/course/advanced-css-and-sass/","course_price":"$12.99"},
    {"name":"Testing (Jest/Cypress)","category":"Testing","importance":"High","course_title":"JavaScript Unit Testing - The Practical Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/","course_price":"$14.99"},
    {"name":"Web Performance Optimization","category":"Performance","importance":"Medium","course_title":"Web Performance Fundamentals","course_provider":"Frontend Masters","course_url":"https://frontendmasters.com/courses/web-perf/","course_price":"$39/mo"},
    {"name":"Git & GitHub","category":"Version Control","importance":"Critical","course_title":"Git & GitHub Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/git-and-github-bootcamp/","course_price":"$12.99"},
    {"name":"CSS-in-JS / Tailwind CSS","category":"Styling","importance":"Medium","course_title":"Tailwind CSS From Scratch","course_provider":"Udemy","course_url":"https://www.udemy.com/course/tailwind-from-scratch/","course_price":"$12.99"},
    {"name":"Webpack / Vite","category":"Build Tools","importance":"Medium","course_title":"Webpack 5 Fundamentals","course_provider":"Udemy","course_url":"https://www.udemy.com/course/webpack-from-beginner-to-advanced/","course_price":"$12.99"},
    {"name":"Accessibility (WCAG)","category":"Accessibility","importance":"Medium","course_title":"Web Accessibility","course_provider":"Coursera","course_url":"https://www.coursera.org/learn/web-accessibility","course_price":"Free to audit"},
  ],
  "Backend Developer": [
    {"name":"Node.js","category":"Runtime","importance":"Critical","course_title":"Node.js, Express, MongoDB & More","course_provider":"Udemy","course_url":"https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/","course_price":"$14.99"},
    {"name":"Python","category":"Language","importance":"Critical","course_title":"Complete Python Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/complete-python-bootcamp/","course_price":"$14.99"},
    {"name":"REST API Design","category":"API","importance":"Critical","course_title":"REST API Design, Development & Management","course_provider":"Udemy","course_url":"https://www.udemy.com/course/rest-api/","course_price":"$12.99"},
    {"name":"SQL & Databases","category":"Database","importance":"Critical","course_title":"The Complete SQL Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/the-complete-sql-bootcamp/","course_price":"$12.99"},
    {"name":"PostgreSQL","category":"Database","importance":"High","course_title":"SQL and PostgreSQL: The Complete Developer's Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/sql-and-postgresql/","course_price":"$14.99"},
    {"name":"Redis","category":"Caching","importance":"High","course_title":"Redis Bootcamp for Beginners","course_provider":"Udemy","course_url":"https://www.udemy.com/course/redis-the-complete-developers-guide/","course_price":"$14.99"},
    {"name":"Docker","category":"DevOps","importance":"High","course_title":"Docker and Kubernetes: The Complete Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/","course_price":"$14.99"},
    {"name":"GraphQL","category":"API","importance":"Medium","course_title":"GraphQL Master Course","course_provider":"Udemy","course_url":"https://www.udemy.com/course/graphql-bootcamp/","course_price":"$12.99"},
    {"name":"Microservices Architecture","category":"Architecture","importance":"High","course_title":"Microservices with Node JS and React","course_provider":"Udemy","course_url":"https://www.udemy.com/course/microservices-with-node-js-and-react/","course_price":"$14.99"},
    {"name":"Message Queues (Kafka/RabbitMQ)","category":"Messaging","importance":"Medium","course_title":"Apache Kafka Series","course_provider":"Udemy","course_url":"https://www.udemy.com/course/apache-kafka/","course_price":"$14.99"},
    {"name":"Authentication & JWT","category":"Security","importance":"Critical","course_title":"Node.js Security Course","course_provider":"Udemy","course_url":"https://www.udemy.com/course/nodejs-security-course/","course_price":"$12.99"},
    {"name":"System Design","category":"Architecture","importance":"Critical","course_title":"System Design Masterclass","course_provider":"Educative","course_url":"https://www.educative.io/courses/grokking-the-system-design-interview","course_price":"$19.99/mo"},
    {"name":"NoSQL (MongoDB)","category":"Database","importance":"High","course_title":"MongoDB - The Complete Developer's Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/mongodb-the-complete-developers-guide/","course_price":"$14.99"},
    {"name":"Java / Spring Boot","category":"Language/Framework","importance":"High","course_title":"Java Spring Boot Masterclass","course_provider":"Udemy","course_url":"https://www.udemy.com/course/spring-boot-tutorial-for-beginners/","course_price":"$14.99"},
    {"name":"Unit & Integration Testing","category":"Testing","importance":"High","course_title":"Test Driven Development in Python","course_provider":"Udemy","course_url":"https://www.udemy.com/course/test-driven-python/","course_price":"$12.99"},
  ],
  "Data Scientist": [
    {"name":"Python","category":"Language","importance":"Critical","course_title":"Python for Data Science and Machine Learning Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/","course_price":"$14.99"},
    {"name":"Machine Learning","category":"ML","importance":"Critical","course_title":"Machine Learning Specialization","course_provider":"Coursera","course_url":"https://www.coursera.org/specializations/machine-learning-introduction","course_price":"Free to audit"},
    {"name":"Pandas & NumPy","category":"Data Processing","importance":"Critical","course_title":"Data Analysis with Pandas and Python","course_provider":"Udemy","course_url":"https://www.udemy.com/course/data-analysis-with-pandas/","course_price":"$14.99"},
    {"name":"Statistics & Probability","category":"Math","importance":"Critical","course_title":"Statistics for Data Science and Business Analysis","course_provider":"Udemy","course_url":"https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/","course_price":"$12.99"},
    {"name":"SQL","category":"Database","importance":"Critical","course_title":"The Complete SQL Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/the-complete-sql-bootcamp/","course_price":"$12.99"},
    {"name":"Data Visualization (Matplotlib/Seaborn)","category":"Visualization","importance":"High","course_title":"Data Visualization with Python","course_provider":"Coursera","course_url":"https://www.coursera.org/learn/python-for-data-visualization","course_price":"Free to audit"},
    {"name":"Scikit-Learn","category":"ML Library","importance":"High","course_title":"Machine Learning with Scikit-Learn","course_provider":"Udemy","course_url":"https://www.udemy.com/course/machine-learning-with-scikit-learn/","course_price":"$12.99"},
    {"name":"Deep Learning (TensorFlow/Keras)","category":"Deep Learning","importance":"High","course_title":"Deep Learning A-Z: Hands-On","course_provider":"Udemy","course_url":"https://www.udemy.com/course/deeplearning/","course_price":"$14.99"},
    {"name":"Feature Engineering","category":"ML","importance":"High","course_title":"Feature Engineering for Machine Learning","course_provider":"Udemy","course_url":"https://www.udemy.com/course/feature-engineering-for-machine-learning/","course_price":"$12.99"},
    {"name":"A/B Testing","category":"Experimentation","importance":"Medium","course_title":"Bayesian Machine Learning in Python: A/B Testing","course_provider":"Udemy","course_url":"https://www.udemy.com/course/bayesian-machine-learning-in-python-ab-testing/","course_price":"$12.99"},
    {"name":"Big Data (Spark/Hadoop)","category":"Big Data","importance":"Medium","course_title":"Apache Spark with Python - Big Data with PySpark","course_provider":"Udemy","course_url":"https://www.udemy.com/course/apache-spark-with-python-big-data-with-pyspark-and-spark/","course_price":"$14.99"},
    {"name":"NLP (Natural Language Processing)","category":"AI","importance":"Medium","course_title":"NLP - Natural Language Processing with Python","course_provider":"Udemy","course_url":"https://www.udemy.com/course/nlp-natural-language-processing-with-python/","course_price":"$14.99"},
  ],
  "ML Engineer": [
    {"name":"Python","category":"Language","importance":"Critical","course_title":"Python for Machine Learning & Data Science Masterclass","course_provider":"Udemy","course_url":"https://www.udemy.com/course/python-for-machine-learning-and-data-science-masterclass/","course_price":"$14.99"},
    {"name":"PyTorch","category":"Deep Learning","importance":"Critical","course_title":"PyTorch for Deep Learning Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/pytorch-for-deep-learning-and-computer-vision/","course_price":"$14.99"},
    {"name":"TensorFlow","category":"Deep Learning","importance":"High","course_title":"TensorFlow 2.0 Complete Course","course_provider":"Udemy","course_url":"https://www.udemy.com/course/tensorflow-developer-certificate-machine-learning-zero-to-mastery/","course_price":"$14.99"},
    {"name":"MLOps","category":"Operations","importance":"Critical","course_title":"MLOps Fundamentals","course_provider":"Coursera","course_url":"https://www.coursera.org/learn/mlops-fundamentals","course_price":"Free to audit"},
    {"name":"Model Deployment (FastAPI/Flask)","category":"Deployment","importance":"Critical","course_title":"Deploy ML Models with FastAPI","course_provider":"Udemy","course_url":"https://www.udemy.com/course/fastapi-the-complete-course/","course_price":"$14.99"},
    {"name":"Docker & Kubernetes","category":"DevOps","importance":"High","course_title":"Docker & Kubernetes: The Complete Guide","course_provider":"Udemy","course_url":"https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/","course_price":"$14.99"},
    {"name":"Feature Engineering","category":"ML","importance":"High","course_title":"Feature Engineering for Machine Learning","course_provider":"Udemy","course_url":"https://www.udemy.com/course/feature-engineering-for-machine-learning/","course_price":"$12.99"},
    {"name":"Experiment Tracking (MLflow)","category":"MLOps","importance":"High","course_title":"MLflow in Action","course_provider":"Udemy","course_url":"https://www.udemy.com/course/mlflow-for-machine-learning/","course_price":"$12.99"},
    {"name":"Large Language Models (LLMs)","category":"AI","importance":"High","course_title":"LangChain & Vector Databases in Production","course_provider":"Udemy","course_url":"https://www.udemy.com/course/langchain/","course_price":"$14.99"},
    {"name":"Mathematics (Linear Algebra, Calculus)","category":"Math","importance":"Critical","course_title":"Mathematics for Machine Learning Specialization","course_provider":"Coursera","course_url":"https://www.coursera.org/specializations/mathematics-machine-learning","course_price":"Free to audit"},
  ],
  "DevOps Engineer": [
    {"name":"Docker","category":"Containerization","importance":"Critical","course_title":"Docker Mastery","course_provider":"Udemy","course_url":"https://www.udemy.com/course/docker-mastery/","course_price":"$14.99"},
    {"name":"Kubernetes","category":"Orchestration","importance":"Critical","course_title":"Kubernetes Mastery","course_provider":"Udemy","course_url":"https://www.udemy.com/course/kubernetesmastery/","course_price":"$14.99"},
    {"name":"CI/CD Pipelines","category":"Automation","importance":"Critical","course_title":"DevOps with GitHub Actions","course_provider":"Udemy","course_url":"https://www.udemy.com/course/github-actions/","course_price":"$14.99"},
    {"name":"Terraform","category":"IaC","importance":"Critical","course_title":"Terraform Masterclass","course_provider":"Udemy","course_url":"https://www.udemy.com/course/terraform/","course_price":"$14.99"},
    {"name":"AWS","category":"Cloud","importance":"Critical","course_title":"AWS Certified Solutions Architect","course_provider":"Udemy","course_url":"https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/","course_price":"$14.99"},
    {"name":"Linux Administration","category":"OS","importance":"Critical","course_title":"Linux Administration Bootcamp","course_provider":"Udemy","course_url":"https://www.udemy.com/course/linux-administration-bootcamp/","course_price":"$12.99"},
    {"name":"Monitoring (Prometheus/Grafana)","category":"Observability","importance":"High","course_title":"Prometheus & Grafana","course_provider":"Udemy","course_url":"https://www.udemy.com/course/prometheus-monitoring/","course_price":"$12.99"},
    {"name":"Ansible","category":"Configuration","importance":"High","course_title":"Ansible for the Absolute Beginner","course_provider":"Udemy","course_url":"https://www.udemy.com/course/learn-ansible/","course_price":"$12.99"},
    {"name":"Bash Scripting","category":"Scripting","importance":"High","course_title":"Bash Scripting and Shell Programming","course_provider":"Udemy","course_url":"https://www.udemy.com/course/bash-scripting/","course_price":"$12.99"},
    {"name":"Networking & Security","category":"Networking","importance":"High","course_title":"Complete Networking Fundamentals","course_provider":"Udemy","course_url":"https://www.udemy.com/course/complete-networking-fundamentals-course-ccna-start/","course_price":"$14.99"},
  ],
}

# ── INTERVIEW QUESTIONS ────────────────────────────────────────────────────────
INTERVIEW_QUESTIONS = [
  # DSA
  {"question":"What is the time complexity of binary search?","answer":"O(log n) — Binary search halves the search space at each step.","difficulty":"Easy","category":"Data Structures & Algorithms","role_title":None,"company_name":None},
  {"question":"Explain the difference between BFS and DFS.","answer":"BFS uses a queue and explores level by level. DFS uses a stack (or recursion) and explores depth first. BFS is better for shortest paths, DFS for topological sort.","difficulty":"Medium","category":"Data Structures & Algorithms","role_title":None,"company_name":None},
  {"question":"How does a HashMap handle collisions?","answer":"Through chaining (linked list at each bucket) or open addressing (linear/quadratic probing). Java's HashMap uses chaining, switching to tree nodes when bucket size exceeds 8.","difficulty":"Medium","category":"Data Structures & Algorithms","role_title":None,"company_name":None},
  {"question":"What is dynamic programming? Give an example.","answer":"DP breaks problems into overlapping subproblems and stores results (memoization/tabulation). Example: Fibonacci, Knapsack, Longest Common Subsequence.","difficulty":"Hard","category":"Data Structures & Algorithms","role_title":None,"company_name":None},
  {"question":"Explain QuickSort's average and worst case complexity.","answer":"Average O(n log n), Worst O(n²) when pivot is always min/max. Randomized pivot avoids worst case in practice.","difficulty":"Medium","category":"Data Structures & Algorithms","role_title":None,"company_name":None},
  # System Design
  {"question":"How would you design a URL shortener like bit.ly?","answer":"Use base62 encoding, a key-value store (Redis/DynamoDB), load balancer, CDN for reads, and an analytics pipeline. Keys are 6-7 chars giving 62^7 = 3.5T combinations.","difficulty":"Medium","category":"System Design","role_title":None,"company_name":None},
  {"question":"What is the CAP theorem?","answer":"A distributed system can guarantee only 2 of 3: Consistency, Availability, Partition Tolerance. During a network partition, choose CP (banks) or AP (social media).","difficulty":"Hard","category":"System Design","role_title":None,"company_name":None},
  {"question":"Explain horizontal vs vertical scaling.","answer":"Vertical: upgrade a single machine (CPU/RAM). Horizontal: add more machines. Horizontal is preferred for high availability and cost efficiency at scale.","difficulty":"Easy","category":"System Design","role_title":None,"company_name":None},
  {"question":"How would you design a notification system?","answer":"Producer-consumer with Kafka/SQS. Notif service reads events, fan-out to channels (push, email, SMS). Use a preferences DB. Rate limit with token buckets.","difficulty":"Hard","category":"System Design","role_title":None,"company_name":None},
  # Behavioral
  {"question":"Tell me about a time you resolved a conflict in your team.","answer":"Use STAR: Situation → Task → Action (active listening, mediation, compromise) → Result (improved collaboration). Focus on empathy and measurable outcomes.","difficulty":"Medium","category":"Behavioral","role_title":None,"company_name":None},
  {"question":"Describe a project where you showed leadership.","answer":"STAR method — highlight taking initiative, making key decisions under pressure, and mentoring others. Quantify the result.","difficulty":"Medium","category":"Behavioral","role_title":None,"company_name":None},
  {"question":"How do you handle tight deadlines?","answer":"Prioritize ruthlessly (MoSCoW), break into milestones, communicate blockers early, use time-boxing, and say no to scope creep.","difficulty":"Easy","category":"Behavioral","role_title":None,"company_name":None},
  # Frontend-specific
  {"question":"What is the Virtual DOM and how does React use it?","answer":"React maintains a lightweight virtual tree, diffs it against the real DOM (reconciliation), and applies minimal updates — avoiding expensive direct DOM manipulation.","difficulty":"Medium","category":"React / Frontend","role_title":"Frontend Developer","company_name":None},
  {"question":"Explain React hooks: useState, useEffect, and useMemo.","answer":"useState manages local state. useEffect handles side effects (API calls, subscriptions) with cleanup. useMemo memoizes expensive computations to prevent re-renders.","difficulty":"Medium","category":"React / Frontend","role_title":"Frontend Developer","company_name":None},
  {"question":"What is code splitting and why is it important?","answer":"Splitting JS bundles via React.lazy + Suspense / dynamic import(). Reduces initial bundle size, improving Time To Interactive (TTI) and Core Web Vitals.","difficulty":"Hard","category":"React / Frontend","role_title":"Frontend Developer","company_name":None},
  # Google-specific
  {"question":"Google: How do you handle large-scale data processing?","answer":"Use MapReduce / BigQuery / Dataflow. Partition data, parallelize processing, use columnar storage, and design for fault tolerance with checkpointing.","difficulty":"Hard","category":"System Design","role_title":None,"company_name":"Google"},
  {"question":"Google: Explain your approach to writing clean, maintainable code.","answer":"Follow SOLID principles, write descriptive names, keep functions small (SRP), add tests for all critical paths, use code reviews, and write documentation.","difficulty":"Medium","category":"Coding Practices","role_title":None,"company_name":"Google"},
  # Amazon-specific
  {"question":"Amazon: Tell me about a time you failed and what you learned.","answer":"Use STAR. Be honest about the failure. Focus on self-awareness, what you learned, and concrete steps taken. Amazon values ownership and learning from mistakes.","difficulty":"Medium","category":"Behavioral","role_title":None,"company_name":"Amazon"},
  {"question":"Amazon: How do you prioritize features for a product?","answer":"Use customer-first thinking (work backwards from press release). Evaluate by impact, effort, revenue, and customer value. Use RICE or MoSCoW framework.","difficulty":"Medium","category":"Product","role_title":None,"company_name":"Amazon"},
  # Meta-specific
  {"question":"Meta: Design Facebook's news feed.","answer":"User graph in social DB. Feed generation: pull vs push hybrid (celebrity problem). Ranking with ML features (recency, affinity, post type). Cache top feeds. Fan-out on write for regular users.","difficulty":"Hard","category":"System Design","role_title":None,"company_name":"Meta"},
]


def seed():
    print("Seeding database...")

    # Companies
    company_map = {}
    for c in COMPANIES:
        existing = db.query(Company).filter_by(name=c["name"]).first()
        if not existing:
            obj = Company(**c)
            db.add(obj)
            db.flush()
            company_map[c["name"]] = obj.id
        else:
            company_map[c["name"]] = existing.id

    # Roles
    role_map = {}
    for r in ROLES:
        existing = db.query(Role).filter_by(title=r["title"]).first()
        if not existing:
            obj = Role(**r)
            db.add(obj)
            db.flush()
            role_map[r["title"]] = obj.id
        else:
            role_map[r["title"]] = existing.id

    # Skills per role
    for role_title, skills in ROLE_SKILLS.items():
        role_id = role_map.get(role_title)
        if not role_id:
            continue
        for s in skills:
            existing = db.query(Skill).filter_by(name=s["name"], role_id=role_id).first()
            if not existing:
                db.add(Skill(role_id=role_id, **s))

    # Interview questions
    for q in INTERVIEW_QUESTIONS:
        role_id = role_map.get(q.pop("role_title", None))
        company_id = company_map.get(q.pop("company_name", None))
        existing = db.query(InterviewQuestion).filter_by(question=q["question"]).first()
        if not existing:
            db.add(InterviewQuestion(role_id=role_id, company_id=company_id, **q))

    db.commit()
    print("✅ Database seeded successfully!")
    print(f"   Companies: {db.query(Company).count()}")
    print(f"   Roles:     {db.query(Role).count()}")
    print(f"   Skills:    {db.query(Skill).count()}")
    print(f"   Questions: {db.query(InterviewQuestion).count()}")


if __name__ == "__main__":
    seed()
    db.close()
