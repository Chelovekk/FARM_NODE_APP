create TABLE usertable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255)
);


create TABLE achievement(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);
create TABLE achievementgoals(
    goal INTEGER,
    ach_id INTEGER,
    FOREIGN KEY (ach_id) 
    REFERENCES achievement (id)
    ON DELETE CASCADE
);


create TABLE user_achievement_progress(
    completed BOOLEAN DEFAULT false,
    progress INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id)
    ON DELETE CASCADE,
    ach_id INTEGER,
    FOREIGN KEY (ach_id) 
    REFERENCES achievement (id)  
    ON DELETE CASCADE
);



