-- Active: 1698226934276@@127.0.0.1@3306@viper
insert into category (category_name,created_At,updated_At) values
  ('초등학생',now(),now()),('중학생',now(), now()),('고등학생',now(), now()),('대학생',now(), now());

select * from category;