-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2025 at 04:27 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jaan_rest`
--

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `pax` int(11) NOT NULL,
  `tableType` varchar(255) NOT NULL,
  `status` enum('pending','confirmed','rejected') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `floor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `name`, `phoneNumber`, `date`, `time`, `pax`, `tableType`, `status`, `createdAt`, `updatedAt`, `floor`) VALUES
(1, 'John Doe', '089564558622', '2025-06-10', '21:30', 3, 'Table 6 pax', 'confirmed', '2025-06-07 08:15:48', '2025-06-07 08:16:22', ''),
(2, 'Yoga', '089564558933', '2025-06-20', '18:23', 2, 'Table 6 pax', 'confirmed', '2025-06-07 08:24:31', '2025-06-07 09:48:20', ''),
(3, 'Samantha Larusso', '089564225611', '2025-06-02', '18:30', 3, 'Sofa 6-10 pax', 'rejected', '2025-06-07 08:28:27', '2025-06-07 09:46:59', ''),
(4, 'Sonny', '089554226322', '2025-06-14', '18:42', 2, 'Sofa 6-10 pax', 'rejected', '2025-06-07 08:42:46', '2025-06-07 09:47:04', 'Second Floor'),
(5, 'John Doe', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 10:15:36', '2025-06-07 10:15:36', '1st'),
(6, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 10:21:22', '2025-06-07 10:21:22', '1st'),
(7, 'johnsy', '089564225611', '2025-06-28', '21:24', 2, 'Table 6 pax', 'pending', '2025-06-07 10:24:18', '2025-06-07 10:24:18', 'Second Floor'),
(8, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 10:51:29', '2025-06-07 10:51:29', '1st'),
(9, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 10:55:45', '2025-06-07 10:55:45', '1st'),
(10, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 10:57:00', '2025-06-07 10:57:00', '1st'),
(11, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:08:28', '2025-06-07 11:08:28', '1st'),
(12, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 11:12:27', '2025-06-07 11:15:54', '1st'),
(13, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 11:13:07', '2025-06-07 11:15:53', '1st'),
(14, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 11:15:22', '2025-06-07 11:15:52', '1st'),
(15, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:18:06', '2025-06-07 11:18:06', '1st'),
(16, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:18:53', '2025-06-07 11:18:53', '1st'),
(17, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:19:34', '2025-06-07 11:19:34', '1st'),
(18, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:31:08', '2025-06-07 11:31:08', '1st'),
(19, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:32:07', '2025-06-07 11:32:07', '1st'),
(20, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:34:29', '2025-06-07 11:34:29', '1st'),
(21, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:34:31', '2025-06-07 11:34:31', '1st'),
(22, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:36:47', '2025-06-07 11:36:47', '1st'),
(23, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:37:01', '2025-06-07 11:37:01', '1st'),
(24, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:41:33', '2025-06-07 11:41:33', '1st'),
(25, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:42:55', '2025-06-07 11:42:55', '1st'),
(26, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:03', '2025-06-07 11:43:03', '1st'),
(27, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:07', '2025-06-07 11:43:07', '1st'),
(28, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:10', '2025-06-07 11:43:10', '1st'),
(29, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:12', '2025-06-07 11:43:12', '1st'),
(30, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:16', '2025-06-07 11:43:16', '1st'),
(31, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:17', '2025-06-07 11:43:17', '1st'),
(32, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:43:18', '2025-06-07 11:59:35', '1st'),
(33, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 11:43:19', '2025-06-07 11:43:19', '1st'),
(34, 'Sambo', '087861446156', '2025-06-06', '22:45', 3, 'Table 6 pax', 'rejected', '2025-06-07 11:45:33', '2025-06-07 11:59:33', 'Second Floor'),
(35, 'APP_PORT', '087861446156', '2025-06-05', '19:49', 2, 'Sofa 6-10 pax', 'rejected', '2025-06-07 11:46:21', '2025-06-07 11:59:30', 'Third Floor'),
(36, 'Ser', 'sds', '2025-06-05', '21:48', 1, 'Table 6 pax', 'confirmed', '2025-06-07 11:48:14', '2025-06-07 11:59:19', 'Second Floor'),
(37, 'Test', '087861446156', '2025-06-07', '21:55', 2, 'Table 6 pax', 'pending', '2025-06-07 11:55:23', '2025-06-07 11:55:23', 'Second Floor'),
(38, 'Jenny', '089564558622', '2025-06-05', '22:59', 2, 'Table 6 pax', 'pending', '2025-06-07 11:56:37', '2025-06-07 11:56:37', 'Second Floor'),
(39, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:56:46', '2025-06-07 13:25:42', '1st'),
(40, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:56:47', '2025-06-07 13:25:47', '1st'),
(41, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:56:47', '2025-06-07 13:25:41', '1st'),
(42, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 11:56:48', '2025-06-07 13:25:37', '1st'),
(43, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:58:32', '2025-06-07 13:25:39', '1st'),
(44, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'confirmed', '2025-06-07 11:58:36', '2025-06-07 12:11:39', '1st'),
(45, 'Berto', '089554226322', '2025-06-12', '23:17', 3, 'Sofa 6-10 pax', 'rejected', '2025-06-07 12:17:57', '2025-06-07 12:30:30', 'Second Floor'),
(46, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:30:17', '2025-06-07 13:02:04', '1st'),
(47, 'Larry Tomlinson', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:38:42', '2025-06-07 12:54:32', '1st'),
(48, 'Liam Payne', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:53:57', '2025-06-07 13:02:03', '1st'),
(49, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:54:24', '2025-06-07 13:02:01', '1st'),
(50, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:55:03', '2025-06-07 13:02:01', '1st'),
(51, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:55:16', '2025-06-07 13:02:02', '1st'),
(52, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:55:55', '2025-06-07 13:01:59', '1st'),
(53, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:56:31', '2025-06-07 13:01:58', '1st'),
(54, 'Harry Styles', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:57:04', '2025-06-07 13:01:57', '1st'),
(55, 'Harry Harold', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'rejected', '2025-06-07 12:58:56', '2025-06-07 13:02:00', '1st'),
(56, 'Niall Horan', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 13:02:29', '2025-06-07 13:02:29', '1st'),
(57, 'Zayn Malik', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 13:02:51', '2025-06-07 13:02:51', '1st'),
(58, 'Alex', '089554226322', '2025-09-20', '23:00', 3, 'Sofa 6-10 pax', 'pending', '2025-06-07 13:06:39', '2025-06-07 13:06:39', 'Second Floor'),
(59, 'Samsul Arief', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 14:06:16', '2025-06-07 14:06:16', '1st'),
(60, 'Samsul Arief', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 14:06:22', '2025-06-07 14:06:22', '1st'),
(61, 'Samsul Arief', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 14:11:18', '2025-06-07 14:11:18', '1st'),
(62, 'Ary Sanjaya', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 14:11:29', '2025-06-07 14:11:29', '1st'),
(63, 'Gerry Geraldy', '08123456789', '2025-06-06', '18:00', 4, 'VIP', 'pending', '2025-06-07 14:12:42', '2025-06-07 14:12:42', '1st');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin123', '$2b$10$BzQQubovlvOxGaI6xllQhOKTsl8V.MPVGTr9O3ZwmTSr1t3Gj/4c.', 'admin', '2025-06-06 09:26:57', '2025-06-06 09:26:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
