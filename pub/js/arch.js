function startArch(){
			$.ajax({
			type:"GET",
			url:"/startIt/",
			async:true,
			success:function(res){
					
				if(res.stat=='YO'){
					alert('Started !');
				}else{
					alert('couldn\'t Start');
				}
		   }
		});
}

function stopArch(){
			$.ajax({
			type:"GET",
			url:"/stopIt/",
			async:true,
			success:function(res){
					
				if(res.stat=='YO'){
					alert('Stopped !');
				}else{
					alert('couldn\'t Stop');
				}
		   }
		});
}