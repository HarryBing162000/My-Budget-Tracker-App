# 💰 Budget Tracker App

A mobile-friendly web app to help you track your income, expenses, and savings across 14-day pay periods. Perfect for managing your finances on the go!

## 📱 Features

### Core Functionality

- **Pay Period Tracking** - Automatically tracks 14-day pay periods (14th-28th and 29th-13th of each month)
- **Net Pay Input** - Set your monthly net pay
- **Savings Target** - Set how much you want to save each period
- **Expense Tracking** - Add, edit, and delete expenses with dates
- **Real-Time Dashboard** - See your net pay, total expenses, remaining balance, and savings at a glance

### Organization & Filtering

- **Expense Grouping** - Expenses automatically grouped by date
- **Sort by Date** - Toggle between newest-first and oldest-first sorting
- **Load More Button** - Efficiently handle 100+ expenses with pagination (shows 10 at a time)

### Data Management

- **Auto-Save** - All data automatically saved to browser storage
- **Multiple Budgets** - Create new budgets each pay period (previous data is saved)
- **Data Persistence** - Your data stays even after closing the app

### Settings & Customization

- **Philippine Peso (₱)** - Currency formatted for PH market
- **Custom Alerts** - Professional, styled alert notifications
- **Mobile Optimized** - Works perfectly on phones, tablets, and desktops
- **Eye-Friendly Colors** - Soft teal color scheme designed to reduce eye strain

## 🚀 How to Use

### Getting Started

1. **Open the App** - Open `index.html` in any web browser or visit the online version
2. **Enter Your Net Pay** - Type your monthly net pay amount and click "Set Net Pay"
3. **Set Your Savings Goal** - Enter how much you want to save and click "Set Savings"

### Adding Expenses

1. **Fill in Expense Details:**
   - **Name** - What you spent on (e.g., "Groceries", "Gas")
   - **Amount** - How much you spent (₱)
   - **Date** - When you made the purchase (defaults to today)
2. **Click "Add Expense"** - Your expense is added and dashboard updates instantly

### Managing Expenses

**Edit an Expense:**

- Click the "Edit" button next to any expense
- Update the details
- Click "Save" to confirm

**Delete an Expense:**

- Click the "Delete" button next to any expense
- Expense is removed and totals are recalculated

**Sort Expenses:**

- Click "📅 Sort by Date" button to toggle between:
  - Newest first (most recent purchases)
  - Oldest first (earliest purchases)

**View More Expenses:**

- Click "Load More Expenses" button to see the next 10 expenses
- Button appears automatically when you have more than 10 expenses

### Understanding Your Dashboard

- **Net Pay** - Your total monthly income
- **Total Expenses** - Sum of all expenses this period
- **Remaining Balance** - Net Pay minus Savings minus Expenses
- **Savings** - Your savings goal (already deducted from remaining balance)

### Starting a New Pay Period

1. **Click "New Budget"** button
2. **Review Your Summary:**
   - Current net pay
   - Savings target
   - Total expenses this period
3. **Confirm** - Your previous data is saved and a new budget begins

## 💡 Tips & Best Practices

### For Better Expense Tracking

- **Name expenses clearly** - Use descriptive names like "Jollibee Lunch" instead of "Food"
- **Add date immediately** - Record the date when you spend, not later
- **Check regularly** - Review expenses weekly to catch any mistakes

### For Smart Budgeting

- **Set realistic savings** - Don't set savings too high; you need spending flexibility
- **Review remaining balance** - Know how much you have left for unplanned expenses
- **Use sort feature** - Check largest expenses to find areas to save

### Data Safety

- Your data is saved in your browser's local storage
- **Backup important data** - Screenshot your dashboard before starting a new period
- **Clear browser cache** - Only do this if you want to delete all saved data
- **Use same browser** - Your data only appears on the device/browser where you entered it

## 💻 System Requirements

### Browsers

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Any modern mobile browser

### Devices

- Desktop computers
- Tablets
- Smartphones (iPhone, Android)
- Any device with a web browser

### Internet

- No internet required! Everything works offline
- Data stored locally on your device

## 🎯 What the App Is Good For

✅ **Perfect if you:**

- Get paid every 14th and 29th
- Want to track daily expenses
- Need a quick, simple budget tool
- Don't want to download apps
- Want something mobile-friendly
- Budget in Philippine Peso

✅ **Use cases:**

- Monthly budget planning
- Expense accountability
- Savings tracking
- Finding where your money goes
- Managing spending between pay periods

## 🌐 Live Demo

Visit the app online:

- **GitHub:** https://github.com/HarryBing162000/My-Budget-Tracker-App

Or run locally:

1. Download the files
2. Open `index.html` in your browser
3. Start tracking!

## 📋 Local Installation (For Developers)

```bash
# Clone the repository
git clone https://github.com/HarryBing162000/My-Budget-Tracker-App.git

# Navigate to the folder
cd My-Budget-Tracker-App

# Open in browser
# On Windows:
start index.html
# On Mac:
open index.html
# On Linux:
xdg-open index.html
```

## 🛠️ Technology Stack

- **HTML5** - Structure with semantic markup
- **CSS3** - Responsive design with flexbox & grid
- **Vanilla JavaScript (ES6)** - Pure JS, no frameworks
- **Browser Storage** - localStorage for data persistence
- **Mobile-First Design** - Optimized for phones first

## 📱 Mobile Features

- **Notch Support** - Safe area insets for modern phones
- **Touch Optimized** - 48px minimum touch targets
- **Responsive Layout** - Adapts to any screen size
- **Offline Capable** - Works without internet
- **Home Screen Icon** - Can be added to home screen like an app
- **ios/Android Ready** - Works on both platforms

## 🎨 Design Philosophy

- **Eye-friendly colors** - Soft teal (#5a8fa3) reduces strain
- **Clean interface** - No clutter, just what you need
- **Logical flow** - Input → View → Manage
- **Accessible** - Large buttons, readable text
- **Fast** - Instant calculations and updates

## ❓ FAQs

**Q: Is my data secure?**
A: Yes! All data stays on your device. We don't send data anywhere.

**Q: Can I use this on multiple devices?**
A: No, data is device-specific. Each phone/computer has separate data.

**Q: What if I clear my browser cache?**
A: Your data will be deleted. Screenshot your dashboard before clearing cache.

**Q: Can I export my expenses?**
A: Currently no, but we may add this feature. Screenshot for backup.

**Q: Does it work offline?**
A: Yes! The app works completely offline with localStorage.

**Q: How many expenses can I add?**
A: Unlimited! The Load More feature handles 100+ expenses smoothly.

**Q: Can I change the currency?**
A: Currently set to Philippine Peso (₱). Contact for other currency support.

## 📝 Version History

**v1.0 (March 2026)**

- Initial release
- Core expense tracking
- Pay period management
- Mobile responsive design
- Load More pagination
- Eye-friendly colors
- App icon

## 📧 Support & Feedback

Found a bug? Have a feature request?

- Create an issue on GitHub
- Share feedback to improve the app

## 📄 License

Open source and free to use. Feel free to modify and share!

---

**Made with ❤️ for budget-conscious individuals**

Start tracking your expenses today! 💰✨
