<!DOCTYPE html>
<html>
<head>
<title>Democracy 2</title>
</head>

<body>

<h2>Address not up to date on licence</h2><br><br>
<br><br>
<form>
	User name:<input type="text" name="userName"><br>
	Password:<input type="text" name="passWord"><br>
	<br>
	New User? <input type="button" value="Register" action="registerUser.html" >
	<br><br>
	Should there be a fine?<br>
	Yes<input type="radio" name="AddressLicenceFineYN" value="Yes">
	No<input type="radio" name="AddressLicenceFineYN" value="No">
	<br><br>

	How much should the fine be?<br>
	Enter a number<input type="text" name="AddressLicenceFinePrice" size='7'>
	<!---     Larger numbers?<input type="radio" name="AddressLicenceFinePriceMore"> --->
	<br>Visual of the fines size...
	<br><br>
	Should there be a licence suspension related to this law?<br>
	Yes<input type="radio" name="AddressLicenceSuspensionYN" value="Yes">
	No<input type="radio" name="AddressLicenceSuspensionYN" value="No">
	<br><br>
	How long should a licence suspension be?<br>
	Enter a number<input type="text" name="AddressLicenceLicenceSuspensionHowMuchTimeValue" size="2">
	<input list="suspensionTimeUnits" name="AddressLicenceSuspensionLength" size="5">
		<datalist id="suspensionTimeUnits">
		  <option value="Hours">
		  <option value="Days">
		  <option value="Weeks">
		  <option value="Months">
	</datalist>

	<br><br>

	Car temporaraly confiscated?<br>
	Yes<input type="radio" name="AddressLicenceConfiscatedYN" value="Yes">
	No<input type="radio" name="AddressLicenceConfiscatedYN" value="No">
	<br><br>
	Time to update address on licence at ICBC(regionalize)it?<br>
	Yes<input type="radio" name="AddressLicenceUpdateYN" value="Yes">
	No<input type="radio" name="AddressLicenceUpdateYN" value="No">
	<br><br>
	How much time?<br>
	Enter a number<input type="text" name="AddressLicenceUpdateHowMuchTimeValue" size="2">
	<!-- Larger numbers?<input type="radio" name="AddressLicenceFinePriceMore"><br> -->

	<input list="updateTimeUnits" name="AddressLicenceUpdateHowMuchTime" size="5">
	<datalist id="updateTimeUnits">
	  <option value="Hours">
	  <option value="Days">
	  <option value="Weeks">
	  <option value="Months">
	</datalist>
	<br>
	<br>
	<input type="submit">
</form>

</body>

</html>