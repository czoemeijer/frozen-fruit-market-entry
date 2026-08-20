-- Run once on an existing D1 database before deploying the three-flavor survey.
ALTER TABLE survey_responses ADD COLUMN favorite_flavor TEXT;
