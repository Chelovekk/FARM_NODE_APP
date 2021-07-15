create TABLE usertable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255)
);
create TABLE userinfo(
    pots_amount INTEGER,
    pots_use INTEGER,
    cabbage_amount INTEGER,
    cabbage_total INTEGER,
    carrot_amount INTEGER,
    carrot_total INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id) 
    ON DELETE CASCADE
);

create TABLE achievements(
    cabbage_goal INT,
    carrot_goal INT,
    login_goal INT
)