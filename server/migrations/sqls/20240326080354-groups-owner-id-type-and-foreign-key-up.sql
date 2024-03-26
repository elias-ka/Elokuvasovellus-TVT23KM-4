ALTER TABLE groups ALTER COLUMN owner_id TYPE uuid;

ALTER TABLE groups
    ADD FOREIGN KEY (owner_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
