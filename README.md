TASK 1 · Pizza Delivery Full-Stack Application
Objective: Build a production-grade, full-stack pizza ordering and inventory management platform with separate Admin and User roles, real-time order tracking, payment integration, and automated stock notifications.
Tech Stack: React.js (frontend), Node.js + Express.js (backend), MongoDB (database), Razorpay (payment — test mode)
Feature Checklist:
User Side:
[ ] User registration with email verification
[ ] User login with JWT-based authorisation
[ ] Forgot password flow (email reset link)
[ ] Dashboard displaying available pizza varieties
[ ] Custom pizza builder flow:
[ ] Step 1: Choose a pizza base (5 options)
[ ] Step 2: Choose a sauce (5 options)
[ ] Step 3: Choose a cheese type
[ ] Step 4: Choose vegetables (multiple select)
[ ] Order summary page before payment
[ ] Razorpay checkout integration (test mode — clicking "Success" confirms the order)
[ ] Real-time order status display on user dashboard (Order Received → In Kitchen → Sent to Delivery)
Admin Side:
[ ] Separate admin login (not accessible from the user registration flow)
[ ] Inventory dashboard showing current stock of: pizza bases, sauces, cheeses, vegetables
[ ] Stock automatically decremented after each order
[ ] Manual stock update capability for each inventory item
[ ] Automated email notification to admin when any inventory item falls below a configurable threshold (e.g., pizza bases < 20 units) — implement using a scheduled job (e.g., node-cron)
[ ] Order management panel: view all incoming orders, update status for each order
[ ] Status change reflected in real-time on the user's dashboard (use polling or WebSockets)
Self-Sourcing Guideline: Search "MERN stack full project tutorial 2024" on YouTube for end-to-end architecture guidance. For Razorpay test integration, search "Razorpay test mode Node.js integration" — Razorpay's official developer documentation has a clear quickstart guide. For email notifications, search "nodemailer Node.js email tutorial" and "node-cron scheduled jobs".
