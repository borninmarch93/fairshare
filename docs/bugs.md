# Bugs

## #01 Registering User without Email

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name but not email
* Click Next
* Continue until your registration is finished

**Expected Result**
* User gets error message that email is missing and Next button should be disabled

**Actual Result**
* Registration will be completed without email and user won't be able to log in when session is finished

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Data validation is missing before API call

**Fix**
* Add form validation on user form
* Add error message if email is blank
* Make Next button disabled if email is blank

---

## #02 Registering User without Company name

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name and email,
* Click Next
* Leave company name blank
* Click Next
* Continue until your registration is finished

**Expected Result**
* User gets error message that Company name is missing and Next button is disabled

**Actual Result**
* Registration will be completed without company name

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Data validation is missing before API call

**Fix**
* Add form validation on company form
* Add error message if Company name is blank
* Make Next button disabled if Company name is blank

---

## #03 Adding shareholder without name

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name, email
* Click Next
* Enter Company name
* Click Next
* Click Add Shareholder
* Leave name field blank
* Click Create 

**Expected Result**
* User gets error message that Shareholder name is missing and Next button is disabled

**Actual Result**
* Shareholder without name will be added

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Data validation is missing

**Fix**
* Add form validation on shareholder form
* Add error message if Shareholder name is blank
* Make Create button disabled if Shareholder name is blank

---

## #04 User can select "Type of shareholder" as a type of shareholder

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name, email
* Click Next
* Enter Company name
* Click Next
* Click Add Shareholder
* Select Type of Shareholder from the Select menu
* Click Create button

**Expected Result**
* Option "Type of Shareholder" is disabled

**Actual Result**
* Option "Type of Shareholder" is enabled

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Option "Type of Shareholder" is enabled

**Fix**
* Disable option "Type of Shareholder"

---

## #05 User can access URL /start/company directly

**Steps to reproduce:**
* Enter /start/company to URL and press enter

**Expected Result**
* User will be redirected to initial step

**Actual Result**
* User can land on the page

**Severity**
* Low

**Priority**
* Medium

**Cause of issue**
* There is no redirect in case of missing registration data

**Fix**
* Add validation and redirect to previous/init step if data is missing

---

## #06 User can access URL /start/shareholders directly

**Steps to reproduce:**
* Enter /start/shareholders to URL and press enter

**Expected Result**
* User will be redirected to previous step

**Actual Result**
* User can land on the page

**Severity**
* Low

**Priority**
* Medium

**Cause of issue**
* There is no redirect in case of missing registration data

**Fix**
* Add validation and redirect to previous/init step if data is missing

---

## #07 Cannot register user if he adds another shareholder

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name, email
* Click Next
* Enter Company name
* Click Next
* Click Add Shareholder
* Enter name and type of Shareholder
* Click Create button
* Click Next button

**Expected Result**
* User should be successfully registered when a shareholder is added

**Actual Result**
* User is not registered and redirected to homepage

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Invalid redirect URL for adding next grant

**Fix**
* Fix redirect URL

---

## #08 User can add grant without grant name

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name, email
* Click Next
* Enter Company name
* Click Next
* Click Add Shareholder
* Enter name and type of Shareholder
* Click Create button
* Click Next button
* Click Add Grant 
* Leave all fields blank
* Click Save button

**Expected Result**
* User should not be allowed to add grant without grant name/share amount/date

**Actual Result**
* User is registered, grant is added without name/share amount/date

**Severity**
* High

**Priority**
* High

**Cause of issue**
* There is no validation of registration form data

**Fix**
* Add validation

---

## #09 User can't specify valid amount of shares

**Steps to reproduce:**
* Go to homepage
* Click on Get Started button
* Enter name, email
* Click Next
* Enter Company name
* Click Next
* Click Add Shareholder
* Enter name and type of Shareholder
* Click Create button
* Click Next button
* Click Add Grant 
* Enter any number other than 1 or 2 in shares amount

**Expected Result**
* User should be allowed to enter any positive integer

**Actual Result**
* User cannot enter any number except for 1 or 2

**Severity**
* High

**Priority**
* High

**Cause of issue**
* Invalid parsing

**Fix**
* Fix parsing of number

---

## #10 Chart shows labels for non-existent data

**Steps to reproduce:**
* Login to application

**Expected Result**
* User should see only see labels for existing data

**Actual Result**
* Chart shows all possible labels

**Severity**
* Low

**Priority**
* Medium

**Cause of issue**
* Code

**Fix**
* 

---

## #11 When logged in, user can add shareholder without name

**Steps to reproduce:**
* Login to application
* Click on Add Shareholder
* Leave shareholder name blank
* Click Save

**Expected Result**
* User should not be able to save new shareholder without his name

**Actual Result**
* User creates new shareholder without name

**Severity**
* High

**Priority**
* High

**Cause of issue**
*  Code

**Fix**
* 

---

## #12 [UX] There is no log out button

**Steps to reproduce:**
* Login to application

**Expected Result**
* User should be able to log out

**Actual Result**
* User cannot log out easily by clicking button

**Severity**
* High

**Priority**
* High

**Cause of issue**
*  Code

**Fix**
* Add logout button

---

## #13 Unit tests failing

**Steps to reproduce:**
* Run yarn test

**Expected Result**
* All tests should pass 

**Actual Result**
* 4 tests fail

**Severity**
* High

**Priority**
* High

**Cause of issue**
*  Code

**Fix**
* 