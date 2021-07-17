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
);


create TABLE user_achievement_progress(
    comleted BOOLEAN DEFAULT false,
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


////////////////////

///////////////////////
create TABLE achievementpreogress(
    cabbage_left INT,
    carrot_left INT,
    login_left INT,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id) 
    ON DELETE CASCADE
);
create TABLE achievements(
    cabbage_ach BOOLEAN DEFAULT false,
    carrot_ach BOOLEAN DEFAULT false,
    login_ach BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id) 
    ON DELETE CASCADE
);


create TABLE goods(
    id PRIMARY KEY,
    name_of_good VARCHAR(255)
);
create TABLE prices(
    price INTEGER,
    FOREIGN KEY (good_id) 
    REFERENCES goods (id) 
    ON DELETE CASCADE
);




create TABLE userinfo(
    pots_amount INTEGER,
    pots_use INTEGER,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id) 
    ON DELETE CASCADE
);
create TABLE goods_users(
    quantity INTEGER,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id),
    FOREIGN KEY (good_id) 
    REFERENCES goods (id) 
);


