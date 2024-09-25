-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: db
-- Время создания: Сен 25 2024 г., 19:22
-- Версия сервера: 8.0.39
-- Версия PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `horizons_stat`
--

-- --------------------------------------------------------

--
-- Структура таблицы `firm`
--

CREATE TABLE `firm` (
  `id_f` int NOT NULL,
  `short_f` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `long_f` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `firm`
--

INSERT INTO `firm` (`id_f`, `short_f`, `long_f`) VALUES
(1, 'ПНТЗ', 'Первоуральский новотрубный завод'),
(2, 'ЧТПЗ', 'Челябинский трубопрокатный завод'),
(3, 'ВТЗ', 'Волжский трубный завод'),
(4, 'ТагМет', 'Таганрогский металлургический завод');

-- --------------------------------------------------------

--
-- Структура таблицы `objects`
--

CREATE TABLE `objects` (
  `id_obj` int NOT NULL,
  `max_obj` int NOT NULL,
  `percent_obj` decimal(5,2) NOT NULL,
  `workshop_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `objects`
--

INSERT INTO `objects` (`id_obj`, `max_obj`, `percent_obj`, `workshop_id`) VALUES
(1, 7050, 0.15, 1),
(2, 9075, 0.10, 2),
(3, 5000, 0.05, 3),
(4, 10000, 0.20, 4),
(5, 5500, 0.35, 5),
(6, 6750, 0.22, 6),
(7, 8700, 0.28, 1),
(8, 5200, 0.30, 7);

-- --------------------------------------------------------

--
-- Структура таблицы `predictor`
--

CREATE TABLE `predictor` (
  `id_pr` int NOT NULL,
  `date_pr` date NOT NULL,
  `time_pr` time NOT NULL,
  `power_pr` int NOT NULL,
  `id_obj_pr` int NOT NULL,
  `type_pr` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Структура таблицы `roles_user`
--

CREATE TABLE `roles_user` (
  `id_role` int NOT NULL,
  `name_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `roles_user`
--

INSERT INTO `roles_user` (`id_role`, `name_role`) VALUES
(1, 'Administrator'),
(2, 'FactoryDirector'),
(3, 'WorkshopChief');

-- --------------------------------------------------------

--
-- Структура таблицы `statistics`
--

CREATE TABLE `statistics` (
  `id_stc` int NOT NULL,
  `date_stc` date NOT NULL,
  `time_stc` time NOT NULL,
  `power_stc` int NOT NULL,
  `id_obj_stc` int NOT NULL,
  `type_stc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `status` (
  `id_stu` int NOT NULL,
  `date_stu` date NOT NULL,
  `start_stu` time NOT NULL,
  `end_stu` time NOT NULL,
  `id_obj_stu` int NOT NULL,
  `type_stu` varchar(50) NOT NULL,
  `is_notified_stu` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Структура таблицы `statuses`
--

CREATE TABLE `statuses` (
  `id` int NOT NULL,
  `type_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `id_role` tinyint(1) DEFAULT NULL,
  `id_workshop` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `hashed_password`, `id_role`, `id_workshop`) VALUES
(1, 'admin', 'Админ Админович Админов', NULL, '$2b$12$eNBMLZZmyXOM2Qzz6FOm2OnmYcPgwfTQRJFh1JPWFibrB9M14d1Wi', 1, 1),
(2, 'admin1', 'Губанов Евгений Валерьевич', NULL, '$2b$12$BY4aFcNEYnxp7D18u0z3LuhDM5pfJR/FT1f1YCYdTPP9VsYwa1B7K', 2, 7),
(4, 'krutoy', 'Афанасьев Вадим Николаевич ', NULL, '$2b$12$OzUCtH6Yynz4vhemzrTdtOgj2KgUtjz64Lboz/Wl5/IwFr.hO84/a', 3, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `workshops`
--

CREATE TABLE `workshops` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `firm_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `workshops`
--

INSERT INTO `workshops` (`id`, `name`, `firm_id`) VALUES
(1, 'ЖелезныйОзон32\r\n', 1),
(2, 'ТВЦ№9', 1),
(3, 'Высота239\r\n', 2),
(4, 'ТПЦ№1', 3),
(5, 'Участок№1', 4),
(6, 'Участок№2', 4),
(7, 'Этерно', 2);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `firm`
--
ALTER TABLE `firm`
  ADD PRIMARY KEY (`id_f`);

--
-- Индексы таблицы `objects`
--
ALTER TABLE `objects`
  ADD PRIMARY KEY (`id_obj`);

--
-- Индексы таблицы `predictor`
--
ALTER TABLE `predictor`
  ADD PRIMARY KEY (`id_pr`);

--
-- Индексы таблицы `statistics`
--
ALTER TABLE `statistics`
  ADD PRIMARY KEY (`id_stc`);

--
-- Индексы таблицы `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_stu`);

--
-- Индексы таблицы `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_statuses_id` (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_username` (`username`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `ix_users_id` (`id`);

--
-- Индексы таблицы `workshops`
--
ALTER TABLE `workshops`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `firm`
--
ALTER TABLE `firm`
  MODIFY `id_f` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `objects`
--
ALTER TABLE `objects`
  MODIFY `id_obj` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `predictor`
--
ALTER TABLE `predictor`
  MODIFY `id_pr` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13112;

--
-- AUTO_INCREMENT для таблицы `statistics`
--
ALTER TABLE `statistics`
  MODIFY `id_stc` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20406;

--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `id_stu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2468;

--
-- AUTO_INCREMENT для таблицы `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `workshops`
--
ALTER TABLE `workshops`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
