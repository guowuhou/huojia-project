 <input class="form-control" name="uploadFiles" type="text" id="textFiled1" readonly="true" style="display:inline;width:300px">
 <button id="screen" class="screen btn btn-primary" style="margin-left:30px">浏览</button> 
 <button class="upload btn btn-primary" style="margin-left:30px">上传</button> 
<form id="uploadForm" action="" method="post" enctype="multipart/form-data">
	<input style="display:none" class="upfiles"  id="textFiled1"  type="file" name="uploadFiles" onchange="document.getElementById('textFiled1').value=value" />
	<input class="submit" style="display:none" type="submit" value="提交" />
</form>