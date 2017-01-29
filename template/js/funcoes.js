function completaURL(){
	var url_atual = window.location.href;
	http://127.0.0.1/Tudo/index.php/principal/
	if(url_atual.indexOf('index.php/principal/') != '-1'){
		return;	
	}else{
		return 'index.php/principal/';
	}	
}

function validaFormulario(){
	$('.formulario').find('input,textarea,select,input[type=checkbox],file').each(function(){
		//Se NÃO for um BOTÃO
		if($(this).attr('type') != 'button' && $(this).attr('type') != 'hidden' && $(this).attr('required') == '1'){
			//Se for um CHECKBOX
			if($(this).val() == ''){
				alert('O campo deve ser preenchido')	
			}	
		}
	});	
}