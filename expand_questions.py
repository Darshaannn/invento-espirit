import json
import os

# Comprehensive list of unique questions with proper sequenceIds and phrasings
all_refined_questions = [
    # --- MEMORY SEQUENCES (Instruction + Recall) ---
    
    # sequence: boy_village
    {"id": 1, "domain": "Memory", "question": "Instruction: A boy lived in a small village.", "subType": "instruction", "sequenceId": "boy_village"},
    {"id": 1001, "domain": "Memory", "question": "Which of these was a category mentioned earlier: 'Village, Kitchen, Stamp'?", "options": ["Village", "Kitchen", "Stamp", "None"], "correct": "Village", "difficulty": "easy", "type": "choice", "sequenceId": "boy_village"},
    
    # sequence: clinic_street
    {"id": 2001, "domain": "Memory", "question": "Instruction: The clinic is located on Maple Street.", "subType": "instruction", "sequenceId": "clinic_street"},
    {"id": 2002, "domain": "Memory", "question": "Where was the clinic located?", "correct": "Maple Street", "difficulty": "medium", "type": "text", "sequenceId": "clinic_street"},
    
    # sequence: john_car
    {"id": 2006, "domain": "Memory", "question": "Instruction: John drove a silver car to the store.", "subType": "instruction", "sequenceId": "john_car"},
    {"id": 2007, "domain": "Memory", "question": "What was the color of the car mentioned?", "options": ["Blue", "Silver", "Red", "Black"], "correct": "Silver", "difficulty": "medium", "type": "choice", "sequenceId": "john_car"},
    
    # sequence: sarah_breakfast
    {"id": 2009, "domain": "Memory", "question": "Instruction: Sarah ate a peach for breakfast.", "subType": "instruction", "sequenceId": "sarah_breakfast"},
    {"id": 2010, "domain": "Memory", "question": "What fruit did Sarah eat for breakfast?", "options": ["Apple", "Orange", "Peach", "Plum"], "correct": "Peach", "difficulty": "medium", "type": "choice", "sequenceId": "sarah_breakfast"},
    
    # sequence: meeting_day
    {"id": 2012, "domain": "Memory", "question": "Instruction: The meeting is scheduled for Tuesday.", "subType": "instruction", "sequenceId": "meeting_day"},
    {"id": 2013, "domain": "Memory", "question": "Which day was the meeting scheduled for?", "options": ["Monday", "Tuesday", "Wednesday", "Friday"], "correct": "Tuesday", "difficulty": "easy", "type": "choice", "sequenceId": "meeting_day"},
    
    # sequence: rabbit_story
    {"id": 2014, "domain": "Memory", "question": "Instruction: A small rabbit hopped across the field.", "subType": "instruction", "sequenceId": "rabbit_story"},
    {"id": 2015, "domain": "Memory", "question": "What animal was mentioned in the instruction?", "options": ["Cat", "Rabbit", "Dog", "Bird"], "correct": "Rabbit", "difficulty": "easy", "type": "choice", "sequenceId": "rabbit_story"},
    
    # sequence: london_flight
    {"id": 2016, "domain": "Memory", "question": "Instruction: The flight to London was delayed.", "subType": "instruction", "sequenceId": "london_flight"},
    {"id": 2017, "domain": "Memory", "question": "Which city was going to be visited in the story?", "options": ["Paris", "London", "New York", "Tokyo"], "correct": "London", "difficulty": "medium", "type": "choice", "sequenceId": "london_flight"},

    # sequence: words_apple (Splitting old ID 13)
    {"id": 13, "domain": "Memory", "question": "Instruction: Remember these words: Apple, Chair, River.", "subType": "instruction", "sequenceId": "words_apple"},
    {"id": 4013, "domain": "Memory", "question": "Which word from the list 'Apple, Chair, River' was shown?", "options": ["Apple", "Car", "Book", "Tree"], "correct": "Apple", "difficulty": "easy", "type": "choice", "sequenceId": "words_apple"},

    # sequence: items_mirror (Splitting old ID 2000)
    {"id": 2000, "domain": "Memory", "question": "Instruction: Remember these items: Mirror, Backpack, Flute.", "subType": "instruction", "sequenceId": "items_mirror"},
    {"id": 4000, "domain": "Memory", "question": "Which item from the list 'Mirror, Backpack, Flute' was shown?", "options": ["Mirror", "Watch", "Book", "Lamp"], "correct": "Mirror", "difficulty": "easy", "type": "choice", "sequenceId": "items_mirror"},

    # sequence: number_429 (Splitting old ID 2004)
    {"id": 2004, "domain": "Memory", "question": "Instruction: Remember the number 429.", "subType": "instruction", "sequenceId": "number_429"},
    {"id": 4004, "domain": "Memory", "question": "What was the number you were just asked to remember?", "correct": "429", "difficulty": "medium", "type": "text", "sequenceId": "number_429"},

    # sequence: name_harrison (Splitting old ID 2008)
    {"id": 2008, "domain": "Memory", "question": "Instruction: Remember the name 'Dr. Harrison'.", "subType": "instruction", "sequenceId": "name_harrison"},
    {"id": 4008, "domain": "Memory", "question": "What was the doctor's name mentioned in the instruction?", "correct": "Harrison", "difficulty": "easy", "type": "text", "sequenceId": "name_harrison"},

    # sequence: code_715 (Splitting old ID 2011)
    {"id": 2011, "domain": "Memory", "question": "Instruction: Remember the code: 715.", "subType": "instruction", "sequenceId": "code_715"},
    {"id": 4011, "domain": "Memory", "question": "What is the code you were asked to remember?", "correct": "715", "difficulty": "hard", "type": "text", "sequenceId": "code_715"},

    # sequence: time_230 (Splitting old ID 3002)
    {"id": 3002, "domain": "Memory", "question": "Instruction: The appointment is at 2:30 PM.", "subType": "instruction", "sequenceId": "time_230"},
    {"id": 4002, "domain": "Memory", "question": "What time was the appointment scheduled for?", "correct": "2:30", "difficulty": "medium", "type": "text", "sequenceId": "time_230"},

    # sequence: dog_max (Splitting old ID 3004)
    {"id": 3004, "domain": "Memory", "question": "Instruction: Max is a gold retriever.", "subType": "instruction", "sequenceId": "dog_max"},
    {"id": 4004, "domain": "Memory", "question": "What was the name of the dog mentioned?", "correct": "Max", "difficulty": "easy", "type": "text", "sequenceId": "dog_max"},

    # --- SINGLE MEMORY QUESTIONS ---
    {"id": 2, "domain": "Memory", "question": "Which sequence did you see earlier: 3-7-2?", "options": ["3-7-2002", "2-7-2003", "7-3-2002", "3-2-2007"], "correct": "3-7-2002", "difficulty": "medium", "type": "choice"},
    {"id": 3, "domain": "Memory", "question": "In a cognitive test, which word is often used as a baseline distracter?", "options": ["Table", "River", "Phone", "Glass"], "correct": "River", "difficulty": "hard", "type": "choice"},
    {"id": 3000, "domain": "Memory", "question": "In terms of seasonal changes, which season follows Summer?", "options": ["Spring", "Summer", "Autumn", "Winter"], "correct": "Autumn", "difficulty": "easy", "type": "choice"},
    {"id": 3001, "domain": "Memory", "question": "Which of these is a common tool found in a workshop?", "options": ["Hammer", "Saw", "Drill", "None"], "correct": "Saw", "difficulty": "medium", "type": "choice"},
    {"id": 3003, "domain": "Memory", "question": "Which planet is often called the Red Planet?", "options": ["Earth", "Mars", "Jupiter", "Venus"], "correct": "Mars", "difficulty": "easy", "type": "choice"},
    {"id": 3005, "domain": "Memory", "question": "Which of these is a stringed instrument?", "options": ["Piano", "Violin", "Guitar", "Flute"], "correct": "Violin", "difficulty": "medium", "type": "choice"},
    {"id": 3006, "domain": "Memory", "question": "Which word is usually first in an alphabetical list: Pen, Pencil, Paper?", "options": ["Pen", "Eraser", "Ruler", "Paper"], "correct": "Paper", "difficulty": "hard", "type": "choice"},

    # --- ATTENTION (20) ---
    {"id": 4, "domain": "Attention", "question": "What comes next: 2, 4, 6, ?", "options": ["7", "8", "9", "10"], "correct": "8", "difficulty": "easy", "type": "choice"},
    {"id": 5, "domain": "Attention", "question": "Find the odd one out", "options": ["Circle", "Square", "Triangle", "Blue"], "correct": "Blue", "difficulty": "medium", "type": "choice"},
    {"id": 6, "domain": "Attention", "question": "Count backward from 100 by 7. What comes after 93?", "options": ["86", "87", "85", "88"], "correct": "86", "difficulty": "hard", "type": "choice"},
    {"id": 3007, "domain": "Attention", "question": "What is 15 + 7?", "options": ["20", "21", "22", "23"], "correct": "22", "difficulty": "easy", "type": "choice"},
    {"id": 3008, "domain": "Attention", "question": "Find the number that comes next: 1, 3, 5, 7, ?", "options": ["8", "9", "10", "11"], "correct": "9", "difficulty": "easy", "type": "choice"},
    {"id": 3009, "domain": "Attention", "question": "Which word is spelled correctly?", "options": ["Recieve", "Receive", "Receve", "Recive"], "correct": "Receive", "difficulty": "medium", "type": "choice"},
    {"id": 3010, "domain": "Attention", "question": "Subtract 3 from 30. What is the result?", "options": ["27", "28", "26", "25"], "correct": "27", "difficulty": "easy", "type": "choice"},
    {"id": 3011, "domain": "Attention", "question": "Find the odd one out: Apple, Banana, Potato, Orange", "options": ["Apple", "Banana", "Potato", "Orange"], "correct": "Potato", "difficulty": "easy", "type": "choice"},
    {"id": 3012, "domain": "Attention", "question": "In the word 'GARDEN', what is the third letter?", "options": ["G", "A", "R", "D"], "correct": "R", "difficulty": "medium", "type": "choice"},
    {"id": 3013, "domain": "Attention", "question": "What is 100 minus 7?", "options": ["92", "93", "94", "95"], "correct": "93", "difficulty": "medium", "type": "choice"},
    {"id": 3014, "domain": "Attention", "question": "Find the next number: 10, 20, 30, 40, ?", "options": ["45", "50", "55", "60"], "correct": "50", "difficulty": "easy", "type": "choice"},
    {"id": 3015, "domain": "Attention", "question": "Which of these is a color?", "options": ["Chair", "Green", "Table", "Window"], "correct": "Green", "difficulty": "easy", "type": "choice"},
    {"id": 3016, "domain": "Attention", "question": "Count backward from 20 by 2. What comes after 16?", "options": ["14", "15", "13", "12"], "correct": "14", "difficulty": "medium", "type": "choice"},
    {"id": 3017, "domain": "Attention", "question": "Find the odd one out: Monday, January, Friday, Sunday", "options": ["Monday", "January", "Friday", "Sunday"], "correct": "January", "difficulty": "medium", "type": "choice"},
    {"id": 3018, "domain": "Attention", "question": "What is 12 multiplied by 2?", "options": ["22", "24", "26", "28"], "correct": "24", "difficulty": "easy", "type": "choice"},
    {"id": 3019, "domain": "Attention", "question": "In the sequence A, B, C, D, what comes next?", "options": ["E", "F", "G", "H"], "correct": "E", "difficulty": "easy", "type": "choice"},
    {"id": 3020, "domain": "Attention", "question": "Find the odd one out: Lion, Tiger, Elephant, Car", "options": ["Lion", "Tiger", "Elephant", "Car"], "correct": "Car", "difficulty": "easy", "type": "choice"},
    {"id": 3021, "domain": "Attention", "question": "What is 50 divided by 5?", "options": ["5", "10", "15", "20"], "correct": "10", "difficulty": "easy", "type": "choice"},
    {"id": 3022, "domain": "Attention", "question": "Which of these is a NOUN?", "options": ["Run", "Happy", "Park", "Quickly"], "correct": "Park", "difficulty": "medium", "type": "choice"},
    {"id": 3023, "domain": "Attention", "question": "Find the missing letter: S, M, T, W, T, F, ?", "options": ["S", "M", "T", "W"], "correct": "S", "difficulty": "hard", "type": "choice"},
    {"id": 3024, "domain": "Attention", "question": "What is 25 + 25 + 25?", "options": ["50", "75", "100", "125"], "correct": "75", "difficulty": "medium", "type": "choice"},
    {"id": 3025, "domain": "Attention", "question": "Find the odd one out: Violin, Flute, Piano, Painting", "options": ["Violin", "Flute", "Piano", "Painting"], "correct": "Painting", "difficulty": "medium", "type": "choice"},
    {"id": 3026, "domain": "Attention", "question": "In the word 'COGNITIVE', how many letters are there?", "options": ["7", "8", "9", "10"], "correct": "9", "difficulty": "hard", "type": "choice"},

    # --- EXECUTIVE FUNCTION (20) ---
    {"id": 7, "domain": "Executive Function", "question": "If today is Monday, tomorrow will be?", "options": ["Sunday", "Tuesday", "Friday", "Saturday"], "correct": "Tuesday", "difficulty": "easy", "type": "choice"},
    {"id": 8, "domain": "Executive Function", "question": "If you rearrange STOP, you get?", "options": ["POST", "TOPS", "POTS", "All of these"], "correct": "All of these", "difficulty": "medium", "type": "choice"},
    {"id": 9, "domain": "Executive Function", "question": "If today is Wednesday, what day will it be after 9 days?", "options": ["Friday", "Saturday", "Sunday", "Monday"], "correct": "Saturday", "difficulty": "hard", "type": "choice"},
    {"id": 3027, "domain": "Executive Function", "question": "If you are second in a race and you overtake the first person, what position are you in?", "options": ["First", "Second", "Third", "None"], "correct": "First", "difficulty": "easy", "type": "choice"},
    {"id": 3028, "domain": "Executive Function", "question": "Unscramble 'ACT':", "options": ["CAT", "TAC", "ATC", "None"], "correct": "CAT", "difficulty": "easy", "type": "choice"},
    {"id": 3029, "domain": "Executive Function", "question": "If a clock shows 3:00, what will it show in 30 minutes?", "options": ["3:15", "3:30", "3:45", "4:00"], "correct": "3:30", "difficulty": "easy", "type": "choice"},
    {"id": 3030, "domain": "Executive Function", "question": "Which of these is used to write?", "options": ["Fork", "Spoon", "Knife", "Pen"], "correct": "Pen", "difficulty": "easy", "type": "choice"},
    {"id": 3031, "domain": "Executive Function", "question": "If you have 3 apples and you take away 2, how many do you have?", "options": ["1", "2", "3", "0"], "correct": "2", "difficulty": "medium", "type": "choice"},
    {"id": 3032, "domain": "Executive Function", "question": "Unscramble 'DOG':", "options": ["GOD", "DOG", "ODG", "Both GOD and DOG"], "correct": "Both GOD and DOG", "difficulty": "easy", "type": "choice"},
    {"id": 3033, "domain": "Executive Function", "question": "If today is Sunday, what day was it 2 days ago?", "options": ["Thursday", "Friday", "Saturday", "Monday"], "correct": "Friday", "difficulty": "medium", "type": "choice"},
    {"id": 3034, "domain": "Executive Function", "question": "Which word does not belong: Hammer, Nail, Screwdriver, Cloud?", "options": ["Hammer", "Nail", "Screwdriver", "Cloud"], "correct": "Cloud", "difficulty": "easy", "type": "choice"},
    {"id": 3035, "domain": "Executive Function", "question": "If a plane crashes on the border of the US and Canada, where do they bury the survivors?", "options": ["USA", "Canada", "On the line", "You don't bury survivors"], "correct": "You don't bury survivors", "difficulty": "hard", "type": "choice"},
    {"id": 3036, "domain": "Executive Function", "question": "Unscramble 'STAR':", "options": ["RATS", "TARS", "ARTS", "All of these"], "correct": "All of these", "difficulty": "medium", "type": "choice"},
    {"id": 3037, "domain": "Executive Function", "question": "If you have a dozen eggs and you break 3, how many are left?", "options": ["3", "6", "9", "12"], "correct": "9", "difficulty": "medium", "type": "choice"},
    {"id": 3038, "domain": "Executive Function", "question": "Which comes first alphabetically: Zebra, Apple, Monkey?", "options": ["Zebra", "Apple", "Monkey", "None"], "correct": "Apple", "difficulty": "easy", "type": "choice"},
    {"id": 3039, "domain": "Executive Function", "question": "If tomorrow is Saturday, what day is today?", "options": ["Thursday", "Friday", "Saturday", "Sunday"], "correct": "Friday", "difficulty": "easy", "type": "choice"},
    {"id": 3040, "domain": "Executive Function", "question": "Unscramble 'BOOK':", "options": ["KOOB", "BOKO", "BOOK", "None"], "correct": "BOOK", "difficulty": "medium", "type": "choice"},
    {"id": 3041, "domain": "Executive Function", "question": "If you turn a right-hand glove inside out, which hand does it fit?", "options": ["Right", "Left", "Both", "Neither"], "correct": "Left", "difficulty": "hard", "type": "choice"},
    {"id": 3042, "domain": "Executive Function", "question": "Which is heavier: A pound of feathers or a pound of lead?", "options": ["Feathers", "Lead", "They weigh the same", "None"], "correct": "They weigh the same", "difficulty": "medium", "type": "choice"},
    {"id": 3043, "domain": "Executive Function", "question": "If a electric train is traveling south, which way is the smoke blowing?", "options": ["North", "South", "East", "There is no smoke"], "correct": "There is no smoke", "difficulty": "hard", "type": "choice"},
    {"id": 3044, "domain": "Executive Function", "question": "Unscramble 'TIME':", "options": ["EMIT", "ITEM", "MITE", "All of these"], "correct": "All of these", "difficulty": "medium", "type": "choice"},
    {"id": 3045, "domain": "Executive Function", "question": "If you have 5 brothers and each brother has one sister, how many sisters do you have?", "options": ["1", "5", "6", "None"], "correct": "1", "difficulty": "hard", "type": "choice"},
    {"id": 3046, "domain": "Executive Function", "question": "Which month has 28 days?", "options": ["February only", "All of them", "Every leap year", "None"], "correct": "All of them", "difficulty": "medium", "type": "choice"},

    # --- ORIENTATION (20) ---
    {"id": 10, "domain": "Orientation", "question": "Which month comes after March?", "options": ["February", "April", "May", "June"], "correct": "April", "difficulty": "easy", "type": "choice"},
    {"id": 11, "domain": "Orientation", "question": "What season usually comes after summer?", "options": ["Winter", "Spring", "Autumn", "Rainy"], "correct": "Autumn", "difficulty": "medium", "type": "choice"},
    {"id": 12, "domain": "Orientation", "question": "How many months are there in a year?", "options": ["10", "11", "12", "13"], "correct": "12", "difficulty": "hard", "type": "choice"},
    {"id": 3047, "domain": "Orientation", "question": "What is the current year?", "correct": "2026", "difficulty": "easy", "type": "text"},
    {"id": 3048, "domain": "Orientation", "question": "In which season do trees usually lose their leaves?", "options": ["Spring", "Summer", "Autumn", "Winter"], "correct": "Autumn", "difficulty": "easy", "type": "choice"},
    {"id": 3049, "domain": "Orientation", "question": "Which country is directly north of the United States?", "options": ["Mexico", "Canada", "Russia", "Brazil"], "correct": "Canada", "difficulty": "medium", "type": "choice"},
    {"id": 3050, "domain": "Orientation", "question": "How many days are in a week?", "options": ["5", "6", "7", "8"], "correct": "7", "difficulty": "easy", "type": "choice"},
    {"id": 3051, "domain": "Orientation", "question": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Rome"], "correct": "Paris", "difficulty": "easy", "type": "choice"},
    {"id": 3052, "domain": "Orientation", "question": "Which month is known for Christmas?", "options": ["October", "November", "December", "January"], "correct": "December", "difficulty": "easy", "type": "choice"},
    {"id": 3053, "domain": "Orientation", "question": "What is the time of day if the sun is directly overhead?", "options": ["Morning", "Noon", "Evening", "Midnight"], "correct": "Noon", "difficulty": "easy", "type": "choice"},
    {"id": 3054, "domain": "Orientation", "question": "In which direction does the sun rise?", "options": ["North", "South", "East", "West"], "correct": "East", "difficulty": "easy", "type": "choice"},
    {"id": 3055, "domain": "Orientation", "question": "How many hours are in a full day?", "options": ["12", "24", "48", "60"], "correct": "24", "difficulty": "easy", "type": "choice"},
    {"id": 3056, "domain": "Orientation", "question": "Which month is the first month of the year?", "options": ["December", "January", "February", "March"], "correct": "January", "difficulty": "easy", "type": "choice"},
    {"id": 3057, "domain": "Orientation", "question": "What is the name of our planet?", "options": ["Mars", "Venus", "Earth", "Jupiter"], "correct": "Earth", "difficulty": "easy", "type": "choice"},
    {"id": 3058, "domain": "Orientation", "question": "Which hand do most people use to wear a watch (if they are right-handed)?", "options": ["Right", "Left", "Both", "None"], "correct": "Left", "difficulty": "medium", "type": "choice"},
    {"id": 3059, "domain": "Orientation", "question": "What is the typical color of the sky on a clear day?", "options": ["Blue", "Red", "Green", "Yellow"], "correct": "Blue", "difficulty": "easy", "type": "choice"},
    {"id": 3060, "domain": "Orientation", "question": "Which season comes after Winter?", "options": ["Spring", "Summer", "Autumn", "Rainy"], "correct": "Spring", "difficulty": "easy", "type": "choice"},
    {"id": 3061, "domain": "Orientation", "question": "How many minutes are in an hour?", "options": ["30", "60", "90", "120"], "correct": "60", "difficulty": "easy", "type": "choice"},
    {"id": 3062, "domain": "Orientation", "question": "Which day comes after Friday?", "options": ["Thursday", "Saturday", "Sunday", "Monday"], "correct": "Saturday", "difficulty": "easy", "type": "choice"},
    {"id": 3063, "domain": "Orientation", "question": "What is the name of the large body of salt water covering much of Earth?", "options": ["River", "Lake", "Ocean", "Pond"], "correct": "Ocean", "difficulty": "easy", "type": "choice"},
    {"id": 3064, "domain": "Orientation", "question": "Which of these is a weekend day?", "options": ["Monday", "Tuesday", "Saturday", "Wednesday"], "correct": "Saturday", "difficulty": "easy", "type": "choice"},
    {"id": 3065, "domain": "Orientation", "question": "What is the name of the frozen water that falls from the sky in winter?", "options": ["Rain", "Snow", "Hail", "Dew"], "correct": "Snow", "difficulty": "easy", "type": "choice"},
    {"id": 3066, "domain": "Orientation", "question": "Which month comes after June?", "options": ["May", "July", "August", "September"], "correct": "July", "difficulty": "easy", "type": "choice"}
]

questions_path = r'c:\Darshan\Innvento\frontend\data\questions.json'

with open(questions_path, 'w', encoding='utf-8') as f:
    json.dump(all_refined_questions, f, indent=4)

print(f"Cleaned and updated questions.json. Total unique items: {len(all_refined_questions)}")
