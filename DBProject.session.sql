-- @block CREATE DATABASE
DROP DATABASE IF EXISTS parkdb;
CREATE DATABASE parkDB;
USE parkDB;

DROP TABLE IF EXISTS Account;
CREATE TABLE Account (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    AccountType ENUM(
        'Customer',
        'Employee'
    ) NOT NULL,
    FirstName VARCHAR(30) NOT NULL,
    MiddleName VARCHAR(30),
    LastName VARCHAR(30) NOT NULL,
    PhoneNumber VARCHAR(14) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Customer;
CREATE TABLE Customer (
    UserID INT PRIMARY KEY,
    FirstName VARCHAR(30) NOT NULL,
    LastName VARCHAR(30) NOT NULL,
    DateOfBirth DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Account(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    UserID INT PRIMARY KEY,
    FirstName VARCHAR(30) NOT NULL,
    MiddleName VARCHAR(10),
    LastName VARCHAR(30) NOT NULL,
    PhoneNumber VARCHAR(14) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Position ENUM(
        'Admin',
        'Park Manager',
        'Department Manager',
        'Maintenance',
        'Employee'
    ) NOT NULL,
    SupUserID INT,
    Salary DECIMAL(10, 2) NOT NULL,
    Street VARCHAR(50),
    City VARCHAR(50),
    State CHAR(2),
    ZipCode CHAR(5),
    Status ENUM('Active', 'Inactive', 'Retired'),
    DepName VARCHAR(255) NOT NULL,
    ScheduleType ENUM ('First Shift', 'Second Shift') Not NULL,
    FOREIGN KEY (UserID) REFERENCES Account(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (SupUserID) REFERENCES Employee(UserID) ON DELETE
    SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Department;
CREATE TABLE Department (
    DepName VARCHAR(255) PRIMARY KEY,
    # HoursWorked INT NOT NULL,
    ManagerUserID INT,
    FOREIGN KEY (ManagerUserID) REFERENCES Employee(UserID) ON DELETE
    SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Attraction;
CREATE TABLE Attraction (
    NameOfAttraction VARCHAR(100) PRIMARY KEY,
    StartOperatingHour TIME NOT NULL,
    EndOperatingHour TIME NOT NULL,
    AttractionType ENUM('Ride', 'Show') NOT NULL,
    HeightRequirementInches DECIMAL(4, 2) NOT NULL,
    WeightRequirementPounds DECIMAL(5, 2) NOT NULL,
    Capacity INT NOT NULL,
    AttractionStatus ENUM('Active', 'Out of Order', 'Inactive') NOT NULL,
    DepName VARCHAR(255) NOT NULL,
    FOREIGN KEY (DepName) REFERENCES Department(DepName) ON DELETE RESTRICT ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Vendor;
CREATE TABLE Vendor (
    NameOfVendor VARCHAR(100) PRIMARY KEY,
    VendorType ENUM('Food', 'Merchandise') NOT NULL,
    VendorStatus ENUM('Active', 'Inactive') NOT NULL,
    DepName VARCHAR(255) NOT NULL,
    FOREIGN KEY (DepName) REFERENCES Department(DepName) ON DELETE RESTRICT ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Product;
CREATE TABLE Product (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    NameOfItem VARCHAR(100) NOT NULL,
    NameOfVendor VARCHAR(100),
    AcquisitionCost DECIMAL(5, 2) NOT NULL,
    SalePrice DECIMAL(5, 2) NOT NULL,
    Profit DECIMAL(5, 2) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    ProductStatus ENUM('Active', 'Inactive') NOT NULL,
    FOREIGN KEY (NameOfVendor) REFERENCES Vendor(NameOfVendor) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Sale;
CREATE TABLE Sale (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    DateSold DATETIME NOT NULL,
    DateValid DATETIME NOT NULL,
    NumTickets INT NOT NULL,
	SaleRefund BOOLEAN NOT NULL DEFAULT 0,
    DiscountApplied BOOLEAN NOT NULL DEFAULT 0,
    TotalPrice DECIMAL(6, 2) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Account(UserID) ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Ticket;
CREATE TABLE Ticket (
    TicketID INT AUTO_INCREMENT PRIMARY KEY,
    SaleID INT,
    TicketType ENUM('GA', 'KI') NOT NULL,
    FoodItemID INT,
    MerchItemID INT,
    TicketPrice DECIMAL(6, 2) NOT NULL,
    FOREIGN KEY (SaleID) REFERENCES Sale(SaleID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FoodItemID) REFERENCES Product(ItemID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (MerchItemID) REFERENCES Product(ItemID) ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS AttractionLog;
CREATE TABLE AttractionLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    NameOfAttraction VARCHAR(100),
    Date DATE NOT NULL,
    NumberOfOperations INT NOT NULL,
    FOREIGN KEY (NameOfAttraction) REFERENCES Attraction(NameOfAttraction) ON DELETE
    SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Maintenance;
CREATE TABLE Maintenance (
    RequestID INT AUTO_INCREMENT,
    StateID INT,
    UserID INT,
    NameOfAttraction VARCHAR(100),
    DescriptionOfRequest VARCHAR(250) NOT NULL,
    Date DATE NOT NULL,
    MaintenanceStatus ENUM('Pending', 'Active', 'Completed') NOT NULL,
    DateCompleted DATE NOT NULL,
    Expense DECIMAL(11, 2),
    DepName VARCHAR(255),
    ManagerApproval TINYINT,
    PRIMARY KEY (RequestID, StateID),
    FOREIGN KEY (UserID) REFERENCES Account(UserID) ON DELETE
    SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (NameOfAttraction) REFERENCES Attraction(NameOfAttraction) ON DELETE
    SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (DepName) REFERENCES Department(DepName) ON DELETE
    SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS WeatherLog;
CREATE TABLE WeatherLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    DateOfClosure DATE NOT NULL,
    WeatherType ENUM(
        'Rainy',
        'Tornado Alert',
        'Hurricane Alert',
        'Excessive Heat Watch',
        'Winter Storm',
        'Flooding',
        'Other'
    ) NOT NULL,
    Description VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Employee(UserID) ON DELETE
    SET NULL ON UPDATE CASCADE
);

ALTER TABLE Account
ADD CONSTRAINT chk_AccountType CHECK (
        AccountType IN (
            'Customer',
            'Employee'
        )
    );
    
ALTER TABLE Account
ADD CONSTRAINT chk_PasswordLength CHECK (LENGTH(Password) >= 8);
ALTER TABLE Account
ADD CONSTRAINT chk_EmailFormat CHECK(Email LIKE '%_@__%.__%');
ALTER TABLE Employee
ADD CONSTRAINT chk_Salary CHECK(Salary > 0);
ALTER TABLE Employee
ADD CONSTRAINT fk_DepartmentName FOREIGN KEY (DepName) REFERENCES Department(DepName) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE Attraction
ADD CONSTRAINT chk_CapacityPositive CHECK (Capacity > 0);
ALTER TABLE Attraction
ADD CONSTRAINT chk_HeightRequirementNonNegative CHECK (HeightRequirementInches >= 0);
ALTER TABLE Attraction
ADD CONSTRAINT chk_WeightRequirementNonNegative CHECK (WeightRequirementPounds >= 0);
ALTER TABLE Attraction
ADD CONSTRAINT chk_OperatingHoursConsistent CHECK (StartOperatingHour < EndOperatingHour);
ALTER TABLE Attraction
ADD CONSTRAINT chk_AttractionStatus CHECK (
        AttractionStatus IN ('Active', 'Out of Order', 'Inactive')
    );
ALTER TABLE Attraction
ADD CONSTRAINT chk_AttractionType CHECK (AttractionType IN ('Ride', 'Show'));
ALTER TABLE Sale
ADD CONSTRAINT chk_PricePositive CHECK (TotalPrice > 0);
ALTER TABLE AttractionLog
ADD CONSTRAINT chk_NumberOfOperationsPositive CHECK (NumberOfOperations > 0);
ALTER TABLE Maintenance
ADD CONSTRAINT chk_ExpenseValid CHECK (Expense >= 0);
ALTER TABLE Vendor
ADD CONSTRAINT chk_VendorStatus CHECK (
        VendorStatus IN ('Active', 'Inactive')
    );
ALTER TABLE Vendor
ADD CONSTRAINT chk_VendorType CHECK (VendorType IN ('Merchandise', 'Food'));
ALTER TABLE Product
ADD CONSTRAINT chk_AcquisitionCost CHECK (AcquisitionCost >= 0);
ALTER TABLE Product
ADD CONSTRAINT chk_SalePrice CHECK (SalePrice >= 0);
ALTER TABLE Product
ADD CONSTRAINT chk_Profit CHECK (Profit >= 0);
ALTER TABLE Product
ADD CONSTRAINT chk_ProductStatus CHECK (ProductStatus IN ('Active', 'Inactive'));

-- @block DELETE DISCOUNT TRIGGER
DROP TRIGGER IF EXISTS saleDiscount;

-- @block Discount Trigger w/ Employee Discount Handling
CREATE TRIGGER saleDiscount
BEFORE INSERT ON Sale
FOR EACH ROW
BEGIN
    DECLARE discountPercent DECIMAL(6, 2);
    DECLARE newTotal DECIMAL(6, 2);
    DECLARE discountApplied BOOLEAN DEFAULT 0;

    DECLARE buyerType VARCHAR(50);

    -- Get userid of the buyer
    DECLARE buyerUserID INT;
    SET buyerUserID = NEW.UserID;

    -- Check if the buyer is an employee or a regular customer
    SELECT AccountType INTO buyerType FROM Account WHERE UserID = buyerUserID;

    IF buyerType = 'Employee' THEN
        -- Apply employee discount
        SET discountPercent = 15;
        SET newTotal = NEW.TotalPrice * (1 - discountPercent / 100);
        SET discountApplied = 1; -- Set discountApplied to true

    ELSE
        -- Check if the total price of the current sale is greater than or equal to 120
        IF NEW.TotalPrice >= 120 THEN
            -- Apply customer discount
            SET discountPercent = 25;
            SET newTotal = NEW.TotalPrice * (1 - discountPercent / 100);

            -- Update final sale price, including discount reduction
            SET NEW.TotalPrice = newTotal;

            SET discountApplied = 1; -- Set discountApplied to true
        END IF;
    END IF;

    -- Set the DiscountApplied column value for the new row
    SET NEW.DiscountApplied = discountApplied;
END;


-- @block Update Initial Account to Admin
UPDATE Account
SET AccountType = 'Employee'
WHERE UserID = 1;

-- @block Delete Initial Account from 'Customer'
DELETE FROM Customer;

-- @block Inserting Departments
INSERT INTO Department(DepName)
VALUES
    ('Central'),
    ('Vendor'),
    ('Attraction'),
    ('Maintenance');

-- @block Insert Initial Account to Employee Table
INSERT INTO Employee(UserID, FirstName, MiddleName, LastName, PhoneNumber, Email, Position, Salary, Street, City, State, ZipCode, Status, DepName, ScheduleType)
VALUES
    (1, 'John', 'D','White', '8320000001', 'wonderlandadmin@gmail.com', 'Admin', 65000, '101 Main Road', 'Houston', 'TX', 77044, 'Active', 'Central', 'First Shift');

-- @block Wonderland Starting Vendors
INSERT INTO Vendor(NameOfVendor, VendorType, VendorStatus, DepName)
VALUES
    ('Joe''s Burger Shack', 'Food', 'Active', 'Vendor'),
    ('Dave''s Devil Wings', 'Food', 'Active', 'Vendor'),
    ('Wonder Eats', 'Food', 'Active', 'Vendor'),
    ('Fun Finds Boutique', 'Merchandise', 'Active', 'Vendor'),
    ('Wonderland Essentials', 'Merchandise', 'Active', 'Vendor');

-- @block Product Entries
INSERT INTO Product(ItemID, NameOfItem, NameOfVendor, AcquisitionCost, SalePrice, Profit, Description, ProductStatus)
VALUES
    (1, 'Burger Deluxe Combo', 'Joe''s Burger Shack', 5.00, 10.99, 5.99, 'A delicious burger with fries and a drink.', 'Active'),
    (2, 'Veggie Burger', 'Joe''s Burger Shack', 4.00, 8.99, 4.99, 'A tasty vegetarian burger with lettuce, tomato, and cheese.', 'Active'),
    (3, 'Spicy Chicken Wings Platter', 'Dave''s Devil Wings', 6.50, 14.99, 6.49, 'A fiery platter of spicy chicken wings served with dipping sauce.', 'Active'),
    (4, 'BBQ Chicken Wings', 'Dave''s Devil Wings', 6.00, 12.99, 5.99, 'Juicy chicken wings smothered in tangy barbecue sauce.', 'Active'),
    (5, 'Wonder Wrap Combo', 'Wonder Eats', 4.50, 9.99, 5.49, 'A healthy wrap filled with fresh ingredients and a side salad.', 'Active'),
    (6, 'Wonder Pizza', 'Wonder Eats', 3.00, 6.99, 3.99, 'A classic 14-inch pizza loaded with cheese and toppings of your choice.', 'Active'),
    (7, 'Park Logo T-Shirt', 'Fun Finds Boutique', 7.50, 19.99, 12.49, 'A stylish t-shirt featuring the park''s logo.', 'Active'),
    (8, 'Plush Toy', 'Fun Finds Boutique', 3.00, 11.99, 5.99, 'A cute and cuddly plush toy of the park''s mascot.', 'Active'),
    (9, 'Park Map and Guidebook', 'Wonderland Essentials', 2.00, 6.99, 4.99, 'A comprehensive map and guidebook for navigating the park.', 'Active'),
    (10, 'Sunglasses', 'Wonderland Essentials', 5.00, 14.99, 9.99, 'Stylish sunglasses to protect your eyes from the sun.', 'Active');

-- @block Inserting Initial Attractions
INSERT INTO Attraction(NameOfAttraction, StartOperatingHour, EndOperatingHour, AttractionType, HeightRequirementInches, WeightRequirementPounds, Capacity, AttractionStatus, DepName)
VALUES
    ('Roller Coaster', '09:00', '21:00', 'Ride', 48.00, 100, 150, 'Active', 'Attraction'),
    ('Ferris Wheel', '09:00', '21:00', 'Ride', 36.00, 70, 90, 'Active', 'Attraction'),
    ('The Drop', '09:00', '21:00', 'Show', 36.00, 80, 120, 'Active', 'Attraction'),
    ('Water Slide', '09:00', '21:00', 'Ride', 36.00, 70, 100, 'Active', 'Attraction'),
    ('Haunted House', '11:00', '17:00', 'Show', 36.00, 70, 65, 'Active', 'Attraction');

-- @block Hot Fixes
UPDATE Attraction
SET AttractionType = 'Ride'
WHERE NameOfAttraction = 'The Drop';

-- @block
SELECT *
FROM account 

-- @block
SELECT *
FROM customer

-- @block
SELECT * 
FROM employee

-- @block
SELECT * 
FROM department

-- @block
SELECT * 
FROM attraction

-- @block
SELECT * 
FROM vendor

-- @block
DELETE FROM vendor

-- @block
SELECT * 
FROM product

-- @block
DELETE FROM product

-- @block
SELECT * 
FROM sale

-- @block
DELETE FROM sale

-- @block
SELECT *
FROM ticket

-- @block
DELETE FROM ticket

-- @block
SELECT * 
FROM attractionlog

-- @block
DELETE FROM attractionlog

-- @block
SELECT * 
FROM maintenance

-- @block
SELECT * 
FROM weatherlog