<? include 'config.php'; if(isset($_SESSION['id'])){ header("Location:main.php"); } include 'header.php'; ?>
<div class="title">Welcome!</div>
<div class="content">
<center>
<table width="551" border="0" align="center" cellpadding="0" cellspacing="0">
  <br><br><tr>
    <td width="168" height="177"><img src="img/LoginSignup.png" width="168" height="163" border="0" usemap="#Map" /></td>
    <td width="8">&nbsp;</td>
    <td width="375"><? @require 'ptx.php' ;?></td>
  </tr>
</table>
<br/></br>
<map name="Map" id="Map"><area shape="rect" coords="-2,127,57,164" href="signin.php" />
<area shape="rect" coords="74,128,169,165" href="signup.php" />
</map>
</div>
<? include 'footer.php'; ?>
