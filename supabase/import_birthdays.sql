-- Auto-generated birthday import SQL
-- Run this in Supabase SQL Editor

-- First, add the date_of_birth column if not exists
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Insert team members with birthdays

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Mariah Barnes', '-', '-', 'Host', '2004-02-04')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Adam Eklund', '-', '-', 'Server', '1999-11-04')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Tyanna Denny', '-', '-', 'Server', '2002-03-18')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Chase Petersen', '-', '-', 'Busser', '2008-01-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Jeffrey Fordyce', '-', '-', 'Server', '1982-11-24')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Christopher JonesBarnes', '-', '-', 'Kitchen', '1989-10-16')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Andrew Hyttinen', '-', '-', 'Runner', '2007-08-31')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Leslie Richmond', '-', '-', 'Runner', '1979-06-29')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Pierre Wallace', '-', '-', 'Runner', '2000-06-09')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Connor Trojanowski', '-', '-', 'Runner', '2003-08-04')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Sadie Siemen', '-', '-', 'Host', '2007-11-03')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Selena Barnstable', '-', '-', 'Runner', '2004-08-10')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Charizma Northern', '-', '-', 'Server', '1995-08-09')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Kuumba Touray', '-', '-', 'Host', '2007-11-28')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Alex Fillmore', '-', '-', 'Bartender', '1999-04-26')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Alexus Bass', '-', '-', 'Host', '2003-09-24')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Mike Drapinski', '-', '-', 'Server', '1971-05-17')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Autumn Nelson', '-', '-', 'Host', '2007-03-09')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Dennis Lehman', '-', '-', 'Busser', '2007-07-26')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Tarzar Jackson', '-', '-', 'Host', '2007-03-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Hope Ridner', '-', '-', 'Server', '2004-11-23')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Ulysses Scott', '-', '-', 'Busser', '2001-02-09')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Allison OConnor-Foss', '-', '-', 'Host', '2009-04-29')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Elisia Mauricio', '-', '-', 'Server', '2004-08-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('william Scruggs', '-', '-', 'Bartender', '1994-11-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Samuel Barkley', '-', '-', 'Runner', '2006-12-22')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Kara Gallegly', '-', '-', 'Bartender', '2002-08-28')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Herwin Albarracin', '-', '-', 'Kitchen', '2005-02-20')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Jaxson greenwood', '-', '-', 'Busser', '2009-03-31')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Felipe Ochoa', '-', '-', 'Dishwasher', '1957-03-04')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Emma Tomas', '-', '-', 'Server', '2003-09-19')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Autumn Morse', '-', '-', 'Host', '2009-04-27')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Kenny Bermudez', '-', '-', 'Host', '2007-12-19')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Willette Talley', '-', '-', 'Server', '1990-06-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Selvon Davis', '-', '-', 'Busser', '2006-09-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Leslie Bernal martinez', '-', '-', 'Busser', '2008-07-29')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Pedro Zambrano', '-', '-', 'Kitchen', '1995-10-18')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Alyssa Regan', '-', '-', 'Server', '2005-07-21')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Alicia Amador', '-', '-', 'Server', '1996-03-20')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Isaiah Mendez', '-', '-', 'Runner', '2006-08-28')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Josh Mabbitt', '-', '-', 'Kitchen', '1992-10-03')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Javonte Manigault', '-', '-', 'Host', '1996-08-14')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Devon Steed', '-', '-', 'Dishwasher', '1988-10-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Lynda Bernard', '-', '-', 'Host', '2004-01-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Canon Stoecker', '-', '-', 'Runner', '2007-03-30')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Lauren Parrott', '-', '-', 'Runner', '2005-03-08')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Brendaly Batrez', '-', '-', 'Server', '2003-04-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Crystal Murphy', '-', '-', 'Server', '1985-03-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Antonio Rosas-Ocampo', '-', '-', 'Runner', '2006-04-02')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Jose Carrasco', '-', '-', 'Kitchen', '2000-04-07')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Aarica Mccray', '-', '-', 'Bartender', '1994-04-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Riley Otzenberger', '-', '-', 'Busser', '2005-04-07')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Elizabeth Avila', '-', '-', 'Server', '2006-11-09')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Lela Huff', '-', '-', 'Server', '2004-11-02')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Cresta Ishler', '-', '-', 'Server', '1974-02-02')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Brianna Uhley', '-', '-', 'Busser', '1999-05-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Alana Jonutz', '-', '-', 'Runner', '2005-12-28')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Autumn Roll', '-', '-', 'Server', '1997-09-30')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Kirsten Dobbs', '-', '-', 'Bartender', '2003-07-12')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Eugene Cottingham', '-', '-', 'Kitchen', '1974-08-03')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Edwin Mendoza Perdomo', '-', '-', 'Runner', '2006-10-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Sydney Shefferly', '-', '-', 'Server', '1999-06-26')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Bailey Booker', '-', '-', 'Server', '2005-10-15')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Nicholas Contreras', '-', '-', 'Server', '1988-12-05')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Lilliann Stivers', '-', '-', 'Server', '2002-01-18')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Jason Ramos Ochoa', '-', '-', 'Host', '2006-03-27')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Emmanuel Arellano', '-', '-', 'Kitchen', '1987-06-18')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Blake Jadczak', '-', '-', 'Server', '2003-11-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Pratheepan Sivanathan', '-', '-', 'Kitchen', '1985-06-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Ashley Blackwell', '-', '-', 'Server', '1990-08-23')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Johanna Ramos', '-', '-', 'Server', '2002-08-06')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Irina Marmueva', '-', '-', 'Server', '1987-03-11')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Ruperto Ramos', '-', '-', 'Kitchen', '1973-01-04')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Jose Abarca-Chavez', '-', '-', 'Kitchen', '1982-01-14')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Tracy Anderson', '-', '-', 'Server', '1969-01-17')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Guadalupe Ramos Ochoa', '-', '-', 'Kitchen', '1982-06-25')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Valerie Raiss', '-', '-', 'Server', '1987-06-23')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Nicole Sullivan', '-', '-', 'Bartender', '1987-09-30')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Matthew Staines', '-', '-', 'Server', '1980-11-22')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Hector Tiscareno', '-', '-', 'Kitchen', '1983-01-18')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Sandra Zamora', '-', '-', 'Kitchen', '1983-09-03')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Esteban Torres', '-', '-', 'Kitchen', '1986-11-28')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, phone, email, position, date_of_birth)
VALUES ('Juan Ochoa', '-', '-', 'Kitchen', '1981-08-03')
ON CONFLICT DO NOTHING;

-- Done! This will import all team members with their birthdays.
