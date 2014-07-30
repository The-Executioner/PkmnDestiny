<?
$register = 1;
$ref= $_GET['ref'];

if ($_POST['submit']) {
include 'dbconf.php';
include 'nliheader.php';

$signuptime = time();
$signupip = $_SERVER['REMOTE_ADDR'];

$_POST['username'] = mysql_real_escape_string($_POST['username']);
$_POST['username'] = trim($_POST['username']);
$_POST['username'] = preg_replace('/\s+/', ' ', $_POST['username']);



$_POST['gender'] = mysql_real_escape_string($_POST['gender']);

if($_POST['gender'] == "M"){
$_POST['gender'] = "M";
}else{
$_POST['gender'] = "F";
}

$_POST['starter'] = mysql_real_escape_string($_POST['starter']);

$_POST['password2'] = mysql_real_escape_string($_POST['password2']);
$_POST['password'] = mysql_real_escape_string($_POST['password']);

$_POST['avatar'] = mysql_real_escape_string($_POST['avatar']);
$_POST['referer'] = mysql_real_escape_string($_POST['referer']);

$_POST['email'] = mysql_real_escape_string($_POST['email']);

$_POST['flag'] = mysql_real_escape_string($_POST['flag']);
$_POST['flag'] = abs((int) $_POST['flag']);

$dontlike = array('.png', 'img/avatars/', '-');
$yoyo   = array('', '', '');
$_POST['avatar']  = str_replace($dontlike, $yoyo, $_POST['avatar']);

if($_POST['starter']=="starters/1.png"){$start="Bulbasaur";$ba=1;}
if($_POST['starter']=="starters/2.png"){$start="Charmander";$ba=2;}
if($_POST['starter']=="starters/3.png"){$start="Squirtle";$ba=3;}
if($_POST['starter']=="starters/4.png"){$start="Chikorita";$ba=4;}
if($_POST['starter']=="starters/5.png"){$start="Cyndaquil";$ba=5;}
if($_POST['starter']=="starters/6.png"){$start="Totodile";$ba=6;}
if($_POST['starter']=="starters/7.png"){$start="Treecko";$ba=7;}
if($_POST['starter']=="starters/8.png"){$start="Torchic";$ba=8;}
if($_POST['starter']=="starters/9.png"){$start="Mudkip";$ba=9;}
if($_POST['starter']=="starters/10.png"){$start="Turtwig";$ba=10;}
if($_POST['starter']=="starters/11.png"){$start="Chimchar";$ba=11;}
if($_POST['starter']=="starters/12.png"){$start="Piplup";$ba=12;}

$multi1 = mysql_query("SELECT id FROM `users` WHERE `ip`='".$signupip."' OR `ip2`='".$signupip."' LIMIT 0,4");
$multi = mysql_num_rows($multi1);

$chosen1 = mysql_query("SELECT id FROM `users` WHERE `username`='".$_POST['username']."'");
$chosen = mysql_num_rows($chosen1);

if($multi > 2 && $_POST['password'] != "chicken1231"){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center><font color=red>Sorry. Too many people with your IP has already registered - please do not create more.</font></center></td></tr>";
}

if (!preg_match('~^[a-z0-9 ]+$~i', $_POST['username'])){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please do not enter special characters in your username.</center></td></tr>";
}elseif(strlen($_POST['username']) < 4 || strlen($_POST['username']) > 20){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>The username you chose has ".strlen($_POST['username'])." characters. You need to have between 4 and 20 characters.</center></td></tr>";
}elseif($chosen > 0){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Sorry. That username has already been taken. Please pick another one.</center></td></tr>";
}



if(strlen($_POST['password']) < 4 || strlen($_POST['password']) > 20){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>The password you chose has ".strlen($_POST['password'])." characters. You need to have between 4 and 20 characters.</center></td></tr>";
}elseif($_POST['password'] != $_POST['password2']){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Your passwords don't match. Please try again.</center></td></tr>";
}

if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $_POST['email'])) {
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please enter a real email.</center></td></tr>";
}

if($_POST['avatar'] < 1 || $_POST['avatar'] > 352) {
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please select a valid avatar.</center></td></tr>";
}elseif (!preg_match('~^[a-z0-9 ]+$~i', $_POST['avatar'])){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>The avatar you chose was invalid.</center></td></tr>";
}

if($_POST['flag'] < 0 || $_POST['flag'] > 283) {
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please select a valid country.</center></td></tr>";
}

if (!preg_match('~^[a-z0-9 ]+$~i', $_POST['username'])){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please do not enter special characters in your username.</center></td></tr>";
}

if (!preg_match('~^[a-z0-9 ]+$~i', $_POST['password'])){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please do not enter special characters in your password.</center></td></tr>";
}

if($ba < 1 || $ba > 12){
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>Please select a valid starter.</center></td></tr>";
}

if (empty($_POST['username']) || empty($_POST['gender']) || empty($_POST['password']) || empty($_POST['password2']) || empty($_POST['email'])) {
$error .= "<tr><td style='background-color: #000000;border: 1px solid #3A0000;'><center>One or more fields have not been filled in.</center></td></tr>";
}

if($error != ""){
echo '<div class="title">Error Message(s)</div><div class="contentcontent"><table class="ranks">'.$error.'</table></div>';

}else{

$sql = "INSERT INTO users (username, password, mail, ip, avatar, signuptime, lastactive, flag) "."VALUES ('".$_POST['username']."','".$_POST['password']."','".$_POST['email']."','".$signupip."','".$_POST['avatar']."','".$signuptime."','".$signuptime."','".$_POST['flag']."')";

$referal = $_GET['ref']; 
$updateit = mysql_query("UPDATE users SET Referals = Referals + 1 WHERE id = $ref"); 

$sqlpoke = "INSERT INTO poke_owned (trainer,gender,name,move1,move2,move3,move4,totalexp,slot) "."VALUES('".$_POST['username']."','".$_POST['gender']."','".$start."','Tackle','Bubble','Pound','Quick Attack','126','1')";

mysql_query($sql, $conn) or die ('Could not create account; ' . mysql_error());
mysql_query($sqlpoke, $conn) or die ('Could not insert pokemon; ' . mysql_error());

mysql_query("UPDATE `server` SET `totalmembers` = `totalmembers` + 1");

if($_POST['gender'] == "M"){
mysql_query("UPDATE `rarity` SET `male` = `male` + 1, `total` = `total` + 1 WHERE `pokemon`='$start'");
}else{
mysql_query("UPDATE `rarity` SET `female` = `female` + 1, `total` = `total` + 1 WHERE `pokemon`='$start'");
}

$user1 = mysql_query("SELECT id FROM `users` WHERE `username`='".$_POST['username']."'");
$user = mysql_fetch_object($user1);

	if ($_POST['referer'] != ""){
	$result= mysql_query("INSERT INTO `referrals` (`when`, `referrer`, `referred`)".
    "VALUES ('$signuptime', '".$_POST['referer']."', '".$_POST['username']."')");
	}
?>
<div class="title">Account Successfully Created</div>
<div class="contentcontent">
<table class="ranks">
<tr>
<td style='background-color: #000000;border: 1px solid #3A0000;'>
<center>
<br>
Welcome to Pokemon Crpg, you can start your adventure by <a href='login.php'>logging in</a>!<br>
<br><br>
<img src="img/avatars/<? echo $_POST['avatar']; ?>.png">
<br><a href="prof.php?user=<? echo $_POST['username']; ?>"><? echo $_POST['username']; ?></a> - #<? echo $user->id; ?>
<br><br>
<img src="<? echo $_POST['starter']; ?>"><br>
<a href="#"><? echo $start; ?></a> - <? echo $_POST['gender']; ?>
<br><br>
</center>
</td>
</tr>
</table>

</div>
<?
include 'nlifooter.php';
die();
}
}else{
include 'nliheader.php';
}
?>
<div class="title">Register - The first step into the world of Pokemon Crpg</div>
<div class="contentcontent">


<table class="ranks">
<tr align="center">
<td style="background-color: #000000;">
<small>This is where you can create your very own Pokemon Trainer, about to embark on the journey of a lifetime. All it takes is a few simple steps.</small>
</td>
</tr>

<tr align="center">

<td class="TR">
<form method="post" action="register.php">
Username:<br />

<input type="text" name="username" size="20" maxlength="20" />
<br><br>

Desired password:<br />
<input type="password" name="password" size="20" maxlength="20" /><br><br>

Verify password:<br>
<input type="password" name="password2" size="20" maxlength="20" /><br><br>

Email Address:<br>
<input type="text" name="email" size="20" /><br><br>

Country Flag:<br>
<sup>(Optional - you can change this later)</sup><br>

		<select name='flag'>
<? include 'flagsform.php'; ?>
		</select>
<br><br>

Avatar:<br>
<sup>(You can change this later)</sup><br>

<select name="avatar" id="avatar" onChange="swapImageb()"> 
<?
include 'avatars5.php';
?>
</select>

<br><br>

<img id="imageToSwapb" src="img/avatars/258.png" alt="pokemon online" />
<br><br><br>

Starter Pokemon:<br>
		<select name="starter" id="starter" onChange="swapImage()"> 
		<option value="starters/1.png">Bulbasaur</option>
		<option value="starters/2.png">Charmander</option>
		<option value="starters/3.png">Squirtle</option>

		<option value="starters/4.png">Chikorita</option>
		<option value="starters/5.png">Cyndaquil</option>
		<option value="starters/6.png">Totodile</option>

		<option value="starters/7.png">Treecko</option>
		<option value="starters/8.png">Torchic</option>
		<option value="starters/9.png">Mudkip</option>


		<option value="starters/10.png">Turtwig</option>
		<option value="starters/11.png">Chimchar</option>
		<option value="starters/12.png">Piplup</option>
		</select>
<br><br>

<img id="imageToSwap" src="starters/1.png" alt="Pokemon Online" />
<br><br>

Pokemon's Gender:<br>

		<select name='gender'>
		<option value='M'>Male</option>
		<option value='F'>Female</option>
		</select>
<br><br>


<input type='hidden' name='referer' value='<?php echo $_GET['r'] ?>'>
<input type="submit" name="submit" value="Register" class="button" />
</td>
</tr>
</form>
</table>
<script type="text/javascript">
function swapImage(){
	var image = document.getElementById("imageToSwap");
	var dropd = document.getElementById("starter");
	image.src = dropd.value;	
};
function swapImageb(){
	var image = document.getElementById("imageToSwapb");
	var dropd = document.getElementById("avatar");
	image.src = dropd.value;	
};
</script>
</div>
<?
include 'nlifooter.php';
?>
