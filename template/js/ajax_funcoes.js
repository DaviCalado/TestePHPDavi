function verificaFimUploads(submete){
	var completa_url = completaURL()
	
	if(submete == '1'){
		document.getElementById('form_uploads').submit();
	}
	$.post(completa_url+'verifica_fim_uploads',
			function(data){
				if(data == '-1'){
					setTimeout(function(){ verificaFimUploads('') }, 500);
				}else if(data == '-2'){
					alert('Erro ao fazer upload! A operação foi cancelada.')
				}else{
					var dados 			= data.split('{S}')
					var campos_uploads  = dados[0]
					var valores_uploads = dados[1]
					//Fez o upload então vamos tentar inserir/atualizar o registro no banco
					inserirAtualizarDados(campos_uploads,valores_uploads)
				}
			}
	);
}

//Funcao que pega os valores do formulario para inserir e/ou atualizar após o upload (se tiver) for completado
function inserirAtualizarDados(campos_uploads,valores_uploads){
	var campos   	= ''
	var valores  	= ''
	var dado     	= ''
	if($('#hd_operacao').val() == 'update'){
		var operacao = 'update'	
	}else{
		var operacao = 'insert'
	}
	var tabela   	 = $('#hd_tabela').val()
	
	$('.formulario').find('input,textarea,select,input[type=checkbox],file').each(function(){
		//Se NÃO for um BOTÃO
		if($(this).attr('type') != 'button' && $(this).attr('type') != 'file' && $(this).attr('type') != 'hidden'){
			//Se for um CHECKBOX
			if($(this).attr('type') == 'checkbox'){
				if($(this).prop('checked')){
					dado = '1'	
				}else{
					dado = '0'	
				}
			}else{
				dado = $(this).val()	
			}
			
			//Coloca o nome(id) dos campos
			campos  += $(this).attr('id')+'|'
			//Coloca os valores dos campos
			valores += dado+'|'	
		}
	});
	
	if(valores_uploads != ''){
		campos  += campos_uploads;
		valores += valores_uploads;
	}else{
		campos  = campos.substr(0,campos.length-1);
		valores = valores.substr(0,valores.length-1);
	}
	
	var completa_url = completaURL()
	
	$.post(completa_url+'operacoesBD/'+operacao+'/'+tabela,{
				'campos'  : campos,
				'valores' : valores,
				'chave'   : tabela+'_id',
				'id'      : $('#hd_registro_id').val()
			},
			function(data){
				if(data != '-1'){
					if(operacao != 'update'){
						alert('O registro foi inserido!')
					}else{
						alert('O registro foi atualizado!')	
					}
				}else{
					if(operacao != 'update'){
						alert('O registro NÃO foi inserido!')
					}else{
						alert('O registro NÃO foi atualizado!')	
					}
				}
			}
	);
}
















function colocaLoad(){
	$('.mask').css('display','block')	
	$('#loader').css('display','block')	
}

function tiraLoad(){
	$('.mask').css('display','none')	
	$('#loader').css('display','block')	
}

function exportaXLS(janela_atual){
	window.open('exporta_xls.php?janela='+janela_atual,'iframe_exporta')
}

function exportaCSV(janela_atual){
	window.open('exporta_csv.php?janela='+janela_atual,'iframe_exporta')
}

function marcaDesmarcaTodos(classe_container){
	$('.'+classe_container).find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).attr('id') != 'check_all2' && !isNaN($(this).attr('id')) ){
			if(classe_container != 'tabela_mensagens'){
				$(this).prop('checked',$('#check_all').prop('checked'))
			}else{
				$(this).prop('checked',$('#check_all2').prop('checked'))
			}
		}
	});	
}

function alteraMenu(){
	if($("#navigation").hasClass("collapsed")){
		var modo = 'aberto'	
	}else{
		var modo = 'fechado'	
	}
	$.post('ajax/alteraMenu.php',{
				'modo': modo
			},
			function(data){
				//
			}
	);
}

function validaCamposFormulario(){
	var parar = '-1'
	$('.formulario').find('input,textarea,select,input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('valida') == '1'){
			if($(this).val() == ''){
				if(parar == '-1'){
					$(this).css('border','solid 1px #FF0000')
					//alert('O campo '+$(this).attr('nome_campo')+' deve ser preenchido.')
					$('.notification_erro').html('O campo '+$(this).attr('nome_campo')+' deve ser preenchido.')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){$('.notification_erro').css('display','none')},5000);
					parar = '1'
				}
			}else{
				$(this).css('border','')
			}
		}
	});	
	if(parar == '1'){
		return '-1'
	}else{
		return '1'	
	}
}

//Função que verifica o login do usuário (vendor)
function fazLogin(usuario,senha){
	$.post('ajax/fazLogin.php',{
				'usuario': usuario,
				'senha'  : senha
			},
			function(data){
				data = trim(data)
				if(data == '1'){
					window.location = 'dashboard.php'
				}else{
					alert('Usuário e/ou senha inválido(s)!')
				}
			}
	);
}

function listaPaineis(valor){
	$.post('ajax/listaPaineis.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_paineis').html(data)
			}
	);
}

function gravaDadosPainel(verde_ou_amarelo){
	if(validaCamposFormulario() == '1'){
		colocaLoad()
		document.getElementById('form_cadastro_painel').submit();
		verificaUploadsPainel(verde_ou_amarelo)
	}
}

function ativaInativaPainel(painel_id,acao){
	$.post('ajax/ativaInativaPainel.php',{
				'painel_id': painel_id,
				'acao'  : acao
			},
			function(data){
				if(acao == 'ativar'){
					var habilitar_desabilitar = 'habilitada'
				}else{
					var habilitar_desabilitar = 'desabilitada'
				}
				$('.notification_alert').html('Tela do Painel '+habilitar_desabilitar+' com sucesso!')
				$('.notification_alert').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_telas_painel.php' },3000);	
			}
	);
}

function excluiPainel(painel_id){
	$.post('ajax/excluiPainel.php',{
				'painel_id': painel_id
			},
			function(data){
				$('.notification_erro').html('Tela do Painel excluida com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_telas_painel.php' },3000);
			}
	);
}

function excluiPaineisEmMassa(){
	var paineis_sele = ''
	$('.tabela_painel').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			paineis_sele += $(this).attr('id')+','
		}
	});
	paineis_sele = paineis_sele.substr(0,paineis_sele.length-1);
	if(paineis_sele != ''){
		$.post('ajax/excluiPaineisEmMassa.php',{
					'paineis_id': paineis_sele
				},
				function(data){
					$('.notification_erro').html('Telas do Painel excluidas com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'listagem_telas_painel.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um painel para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function verificaUploadsPainel(verde_ou_amarelo){
	$.post('ajax/verificaUploadsPainel.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					if(verde_ou_amarelo == 'V'){
						$('.notification_sucesso').html('Tela salva com sucesso!')
						$('.notification_sucesso').css('display','block')
					}else{
						$('.notification_alert').html('Tela atualizada com sucesso!')
						$('.notification_alert').css('display','block')
					}
					tiraLoad()
					window.setTimeout(function(){ window.location = 'listagem_telas_painel.php' },3000);	
				}else{
					window.setTimeout(function(){verificaUploadsPainel(verde_ou_amarelo)},500)
				}
			}
	);
}

function listaPopups(valor){
	$.post('ajax/listaPopups.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_popups').html(data)
			}
	);
}

function gravaDadosPopup(verde_ou_amarelo){
	if(validaCamposFormulario() == '1'){
		colocaLoad()
		document.getElementById('form_cadastro_popup').submit();
		if(verde_ou_amarelo == 'V'){
			$('.notification_sucesso').html('Popup salvo com sucesso!')
			$('.notification_sucesso').css('display','block')
		}else{
			$('.notification_alert').html('Popup atualizado com sucesso!')
			$('.notification_alert').css('display','block')
		}
		tiraLoad()
		window.setTimeout(function(){ window.location = 'listagem_popups.php' },3000);
	}
}

function ativaInativaPopup(popup_id,acao){
	$.post('ajax/ativaInativaPopup.php',{
				'popup_id': popup_id,
				'acao'  : acao
			},
			function(data){
				if(acao == 'ativar'){
					var habilitar_desabilitar = 'habilitado'
				}else{
					var habilitar_desabilitar = 'desabilitado'
				}
				$('.notification_alert').html('Popup '+habilitar_desabilitar+' com sucesso!')
				$('.notification_alert').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_popups.php' },3000);
			}
	);
}

function excluiPopup(popup_id){
	$.post('ajax/excluiPopup.php',{
				'popup_id': popup_id
			},
			function(data){
				$('.notification_erro').html('Popup excluido com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_popups.php' },3000);
			}
	);
}

function excluiPopupsEmMassa(){
	var popups_sele = ''
	$('.tabela_popup').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			popups_sele += $(this).attr('id')+','
		}
	});
	popups_sele = popups_sele.substr(0,popups_sele.length-1);
	if(popups_sele != ''){
		$.post('ajax/excluiPopupsEmMassa.php',{
					'popups_id': popups_sele
				},
				function(data){
					$('.notification_erro').html('PopUps excluidos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'listagem_popups.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um popup para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function listaChamados(valor){
	$.post('ajax/listaChamados.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				var dados = data.split('{SEPARADOR}')
				$('#listagem_chamados').html(dados[0])
				$('#hd_pontos_mapa').val(dados[1])
			}
	);
}

function listaChamadosAtendidos(valor){
	$.post('ajax/listaChamadosAtendidos.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_chamados_atendidos').html(data)
			}
	);
}

function excluiChamado(chamado_id){
	$.post('ajax/excluiChamado.php',{
				'chamado_id': chamado_id
			},
			function(data){
				$('.notification_erro').html('Chamado excluido com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_chamados_atendidos.php' },3000);
			}
	);
}

function excluiChamadosEmMassa(tabela){
	var chamados_sele = ''
	$('.'+tabela).find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			chamados_sele += $(this).attr('id')+','
		}
	});
	chamados_sele = chamados_sele.substr(0,chamados_sele.length-1);
	if(chamados_sele != ''){
		$.post('ajax/excluiChamadosEmMassa.php',{
					'chamados_id': chamados_sele
				},
				function(data){
					$('.notification_erro').html('Chamados excluidos com sucesso!')
					$('.notification_erro').css('display','block')
					if(tabela == 'tabela_chamados'){
						window.setTimeout(function(){ window.location = 'listagem_chamados.php' },3000);
					}else{
						window.setTimeout(function(){ window.location = 'listagem_chamados_atendidos.php' },3000);	
					}
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um chamado para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function marcaPontosMapa(param){
	if(param != '1'){
		window.setTimeout(function(){ marcaPontosMapaFinal() },1000);	
	}else{
		window.setTimeout(function(){ marcaPontosMapaVinculos() },1000);	
	}
}

function marcaPontosMapaFinal(){
	var dados_mapa = $('#hd_pontos_mapa').val()
	//Limpa o array de markers
	var markers    	 		= [];
	var nomes      	 		= [];
	var imagens      		= [];
	var fones        		= [];
	var foto_users   		= [];
	var fotos_panico 		= []
	var tipos_panico 		= [];
	var mensagens_panico 	= [];
	var ids 	     		= [];
	markers.length   		= 0
	
	//Os dois decodificam o JSON
	//var dados = JSON.parse(dados_mapa);
	var dados_map  = dados_mapa.split('{S}')
	var infowindow = new google.maps.InfoWindow(), marker, i;
	var foi = 0;
	for(var i=0;i<dados_map.length;i++){
		dados         		= dados_map[i].split('|')
		var lat  	  		= dados[0]
		var long 	  		= dados[1]
		nomes[i]      		= dados[2]
		//imagens[i]    	=  '../../../../loja/uploads/panico/icon_'+dados[3]
		imagens[i]    		=  'http://www.clicknalupa.com.br/loja/uploads/panico/pino-mapa.png'
		fones[i]      		= dados[4]
		
		var fb_id = dados[9];
		if(fb_id != ''){
			foto_users[i] = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
		}else if(file_exists('../loja/uploads/user_image/user_'+dados[5]+'.jpg')){
			foto_users[i] = '../loja/uploads/user_image/user_'+dados[5]+'.jpg'
		}else{
			foto_users[i] = 'https://graph.facebook.com//picture?type=large'
		}
		fotos_panico[i] 	=  '../loja/uploads/panico/'+dados[3]
		ids[i]        		= dados[6]
		tipos_panico[i] 	= dados[7]
		mensagens_panico[i] = dados[8]
		foi++;
		if(foi=='1'){
			//Inicializa o mapa
			var mapOptions = {
			  center: new google.maps.LatLng(lat,long),
			  zoom: 7,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
		}
					
		//var image = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
		var image = imagens[i];
		var lat_long = new google.maps.LatLng(lat,long);
		
		
		//Check Markers array for duplicate position and offset a little
		if(markers.length != 0) {
			for (i=0; i < markers.length; i++) {
				var existingMarker = markers[i];
				var pos = existingMarker.getPosition();
				if (lat_long.equals(pos)) {
					var a = 360.0 / markers.length;
					var newLat = pos.lat() + -.00004 * Math.cos((+a*i) / 180 * Math.PI);  //x
					var newLng = pos.lng() + -.00002 * Math.sin((+a*i) / 180 * Math.PI);  //Y
					var lat_long = new google.maps.LatLng(newLat,newLng);
				}
			}
		}
		
		var marker = new google.maps.Marker({
							 map: map,
							 title: nomes[i],
							 position: lat_long,
							 icon:image
						 });
		//Coloca a marker no array de markers
		markers.push(marker);
	}
	
	//Troca o icone e a cor do texto do ícone
	var clusterStyles = [
						  {
							textColor: 'black',
							url: 'http://www.clicknalupa.com.br/loja/uploads/others/icon_marker_cluster.png',
							height: 50,
							width: 50
						  }
						];
	
	var mcOptions = {gridSize: 50,styles: clusterStyles, maxZoom: 15};
	var mc = new MarkerClusterer(map, markers, mcOptions);
	for(var p=0;p<markers.length;p++){
		var marker = markers[p];
		google.maps.event.addListener(marker, 'click', (function(marker, p) {
				 return function() {
					infowindow.setContent('<div class="mapa_ponto">'+
												'<table>'+
													'<tr>'+
														'<td><img width="100" height="100" src="'+foto_users[p]+'"/></td>'+
														'<td style="width: 274px;text-align: right;"><img width="100" height="100" src="'+fotos_panico[p]+'"/></td>'+
													'</tr>'+
													'<tr>'+
														'<td style="padding-top:10px"><b>Usuário:</b>&nbsp;'+nomes[p]+'</td>'+
														'<td style="padding-top:10px; width: 274px;text-align: right;"><b>Tipo do alerta:</b>&nbsp;'+tipos_panico[p]+'</td>'+
													'</tr>'+
													'<tr>'+
														'<td><b>Fone:&nbsp;</b>'+fones[p]+'</td>'+
														'<td style="width: 274px;text-align: right;"><b>Alerta:</b>&nbsp;'+mensagens_panico[p]+'</td>'+
													'</tr>'+
												'</table>'+
												'<div style="text-align:center;padding-top:4px">'+
													'<a class="btn btn-sm btn-primary" href="#modalDialog'+ids[p]+'" role="button" data-toggle="modal"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Detalhe</a>'+
													'<a class="btn btn-warning btn-sm" href="#modalDialogMensagem'+ids[p]+'" role="button" data-toggle="modal">'+
														'<i class="fa fa-share-square-o" aria-hidden="true"></i> Enviar Mensagem'+
													'</a>'+
													'<a class="btn btn-success btn-sm" href="#modalDialogAtendido'+ids[p]+'"role="button" data-toggle="modal">'+
														'<i class="fa fa-check-square-o" aria-hidden="true"></i> Atendido'+
													'</a>'+
												'</div>'+
										   '</div>');			
					infowindow.open(map, marker);
				}
			})(marker, p));
	}
}

function montaMapaDetalhesChamadosAtendidos(id_mapa,lat,long){
	window.setTimeout(function(){ 
		var mapOptions = {
		  center: new google.maps.LatLng(lat,long),
		  zoom: 12,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById('div_mapa'+id_mapa), mapOptions);	
		
		var marker= new google.maps.Marker({
                            position:new google.maps.LatLng(lat,long)
                        });
                            
        marker.setMap(map);
	},500);
}

function atualizaStatusChamadoAtendido(chamado_id){
	$.post('ajax/atualizaStatusChamadoAtendido.php',{
				'chamado_id' : chamado_id,
				'status_desc': $('#status_desc'+chamado_id).val()
			},
			function(data){
				$('.notification_sucesso').html('Chamado atendido com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){ window.location = 'listagem_chamados.php' },2500);
			}
	);
}

function enviarMensagemChamadoAtendido(chamado_id){
	colocaLoad()
	//Significa que estou enviando mensagem pra vários usuarios, sem estar atrelado a um chamado
	if(chamado_id == ''){
		var users_push_id 		= '';
		var array_users_push_id = [];
		var users_ids     		= '';
		var cont = 0;
		$('.tabela_users_envio_push').find('input[type=checkbox]').each(function(){
			if($(this).attr('id') != 'check_all' && $(this).prop('checked')){
				users_push_id 			  += $(this).attr('token')
				users_ids     			  += $(this).attr('id')+','
				array_users_push_id[cont]  = $(this).attr('token')
				cont++;
			}
		});
		users_ids = users_ids.substr(0,users_ids.length-1);
		
		if(users_ids == ''){
			$('.notification_erro').html('Ao menos um usuário deve ser escolhido para enviar mensagem.')
			$('.notification_erro').css('display','block')
			window.setTimeout(function(){$('.notification_erro').css('display','none')},5000);	
			tiraLoad();
			return false;
		}
		
		//Que tipo de som vai fazer no push...
		if(document.getElementById('check_confirmacao').checked){
			var som_ios 	= 'www/notificacoes/msg_confirmacao.mp3';  
			var som_android = 'msg_confirmacao'
		}else{
			var som_ios 	= 'www/notificacoes/msg.mp3';  
			var som_android = 'msg'
		}
		
		//Se quiser fazer o envio do push aqui...
		$.post('https://onesignal.com/api/v1/notifications',{
					app_id			   : "f248a8c9-8f46-440f-9cc5-6c2a4d6f6c05",
					headings           : {en: 'Nova Mensagem'},
					contents           : {en: 'Você recebeu uma nova mensagem...'},
					include_player_ids : array_users_push_id,
					android_led_color  : "FF0000FF",
					ios_sound          : som_ios,
					android_sound      : som_android
				},
				function(data){
					//
				}
		)
		
		$('#hd_user_id').val(users_ids)
		document.getElementById('form_envia_mensagem_chamado').submit();
		verificaUploadsEnviaMensagemChamado('1')
	}else{
		document.getElementById('form_envia_mensagem_chamado'+chamado_id).submit();
		verificaUploadsEnviaMensagemChamado('')
	}
	
}

function verificaUploadsEnviaMensagemChamado(nao_recarrega){
	$.post('ajax/verificaUploadsEnviaMensagemChamado.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					$('.notification_sucesso').html('Mensagem enviada com sucesso!')
					$('.notification_sucesso').css('display','block')
					tiraLoad()
					if(nao_recarrega != '1'){
						window.setTimeout(function(){ window.location = 'listagem_chamados.php' },2500);	
					}
				}else{
					if(nao_recarrega != '1'){
						window.setTimeout(function(){verificaUploadsEnviaMensagemChamado()},500)
					}else{
						window.setTimeout(function(){verificaUploadsEnviaMensagemChamado('1')},500)	
					}
				}
			}
	);
}

function ativaInativaFlagsUserVendor(user_vendor_id,campo){
	if($('#ch_'+campo+user_vendor_id).prop('checked') == false){
		$('#ch_'+campo+user_vendor_id).prop('checked',true)
		var ativa_inativa = '1'
	}else{
		$('#ch_'+campo+user_vendor_id).prop('checked',false)	
		var ativa_inativa = '0'
	}
	$.post('ajax/ativaInativaFlagsUserVendor.php',{
				'user_vendor_id': user_vendor_id,
				'campo'  		: campo,
				'ativa_inativa' : ativa_inativa,
			},
			function(data){
				//
			}
	);
}


//enviaPushNotification(user_push_id,'Mensagem de Pânico',tipo_panico,usuario_logado+'|'+tipo_panico+'|'+img_panico)
function enviaPushNotification(){
	var users_push_id  = [];
	var users_ids = ''; 
	var cont = 0;
	$('.tabela_users_envio_push').find('input[type=checkbox]').each(function(){
		if($(this).attr('id') != 'check_all_users' && $(this).prop('checked')){
			users_push_id[cont] = $(this).attr('token')
			users_ids           += $(this).attr('id')+','
			cont++;
		}
	});
	users_ids = users_ids.substr(0,users_ids.length-1);
	
	//Usuarios que receberão a mensagem
	var title         = $('#title_notification').val()
	var message       = $('#message_notification').val()
	//Dados para criar a janela de push no nosso padrao do app <=> ENVIADO POR, TIPO DE PANICO, IMAGEM
	var dados         = 'Equipe CnLS|'+title+'|logo.png'
	
	if(users_push_id.length == 0){
		$('.notification_erro').html('Um usuário deve ser escolhido para enviar a mensagem.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
		return false;
	}
	
	if(title == ''){
		$('.notification_erro').html('A notificação deve ser preenchida para enviar.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
		return false;	
	}
	
	if(title == ''){
		$('.notification_erro').html('A mensagem deve ser preenchida para enviar.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
		return false;	
	}
	
	$.post('https://onesignal.com/api/v1/notifications',{
				app_id			   : "f248a8c9-8f46-440f-9cc5-6c2a4d6f6c05",
 			    headings           : {en: title},
				contents           : {en: message},
				include_player_ids : users_push_id,
				android_led_color  : "FF0000FF",
				data               : {"dados": dados}
			},
			function(data){
				$('.notification_sucesso').html('A mensagem foi enviada com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){ 
												$('.notification_sucesso').css('display','none') 
												window.location = 'envio_pushs_my_security.php'
											},3000);
				$.get('http://clicknalupa.com.br/loja/index.php/vendor/envios_push/grava_dados',{
							tipo      : title,
							mensagem  : message,
							users     : users_ids
						},
						function(data){
							//
						}
				)
			}
	)
}

function listaUsuariosDependentes(valor){
	$.post('ajax/listaUsuariosDependentes.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_usuarios_dependentes').html(data)
			}
	);
}

function aceitaUsuarioDependente(usuario_vendor_id){
	$.post('ajax/aceitaUsuarioDependente.php',{
				'usuario_vendor_id': usuario_vendor_id
			},
			function(data){
				$('.notification_sucesso').html('Usuário aceito com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){ window.location = 'usuarios_dependentes.php' },3000);
			}
	);
}

function excluiUsuarioDependente(usuario_vendor_id){
	$.post('ajax/excluiUsuarioDependente.php',{
				'usuario_vendor_id': usuario_vendor_id
			},
			function(data){
				$('.notification_erro').html('Usuário dependente excluido com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'usuarios_dependentes.php' },3000);
			}
	);
}

function excluiUsuariosDependentesEmMassa(tabela){
	var users_sele = ''
	$('.'+tabela).find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true && !isNaN($(this).attr('id'))){
			users_sele += $(this).attr('id')+','
		}
	});
	users_sele = users_sele.substr(0,users_sele.length-1);
	
	if(users_sele != ''){
		$.post('ajax/excluiUsuariosDependentesEmMassa.php',{
					'usuarios_id': users_sele
				},
				function(data){
					$('.notification_erro').html('Usuários dependentes excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'usuarios_dependentes.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um usuário dependente para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function listaMensagensEnviadas(valor){
	$.post('ajax/listaMensagensEnviadas.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_mensagens_enviadas').html(data)
			}
	);
}

function excluiMensagemEnviada(mensagem_enviada_id){
	$.post('ajax/excluiMensagemEnviada.php',{
				'mensagem_enviada_id': mensagem_enviada_id
			},
			function(data){
				$('.notification_erro').html('Mensagem excluida com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'pushs_enviados_my_security.php' },3000);
			}
	);
}

function excluiMensagensEmMassa(tabela){
	var mensagens_sele = ''
	$('.'+tabela).find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			mensagens_sele += $(this).attr('id')+','
		}
	});
	mensagens_sele = mensagens_sele.substr(0,mensagens_sele.length-1);
	
	if(mensagens_sele != ''){
		$.post('ajax/excluiMensagensEmMassa.php',{
					'mensagens_id': mensagens_sele
				},
				function(data){
					$('.notification_erro').html('Mensagens excluídas com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'pushs_enviados_my_security.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos uma mensagem para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

var markersRealArray = [];
var i_mapa_real      = 0;
var interval_mapa_real;
//Funcao que limpa os pontos do mapa
function limpaPontosMapaReal() {
	for (var i = 0; i < markersRealArray.length; i++ ) {
		markersRealArray[i].setMap(null);
	}
	markersRealArray = [];
}

function mapaUsuarioDependenteTempoReal(id_mapa,lat,long,user_id,inicio){
	if(inicio == '1'){
		if($('#ch_gps'+id_mapa).prop('checked') == false){
			$('#div_mapa_real'+id_mapa).html('<BR><BR><BR><BR><BR><span style="padding-left:80px;color:#ff0000;font-weight:bold">Esse usuário não tem permissão para ser visto no mapa em tempo real.</span>')
			return false;	
		}
		limpaPontosMapaReal()
		i_mapa_real = 0;
		/*if(lat == ''){
			lat  = '-23.549594'; 
			long = '-46.634009';	
		}*/
		window.setTimeout(function(){ 
			$.post('ajax/pegaLatLongTempoReal.php',{
						'user_id': user_id 
					},	
					function(data){
						limpaPontosMapaReal()
						data = trim(data)
						var dados = data.split('|')
						
						var mapOptions = {
							  center: new google.maps.LatLng(dados[0],dados[1]),
							  zoom: 15,
							  mapTypeId: google.maps.MapTypeId.ROADMAP
							}
							map = new google.maps.Map(document.getElementById('div_mapa_real'+id_mapa), mapOptions);	
							
							var marker= new google.maps.Marker({
												position:new google.maps.LatLng(dados[0],dados[1])
											});
												
							marker.setMap(map);
							markersRealArray.push(marker);
							
							//Chama a cada 2 segundos
							interval_mapa_real = setInterval(function(){mapaUsuarioDependenteTempoReal(id_mapa,lat,long,user_id,'0')},2000)
					}
			);
		},500);
	}else{
		$.post('ajax/pegaLatLongTempoReal.php',{
					'user_id': user_id 
				},	
				function(data){
					limpaPontosMapaReal()
					var dados = data.split('|')
					var marker=new google.maps.Marker({
							position:new google.maps.LatLng(dados[0],dados[1])
						});
							
					marker.setMap(map);		
					markersRealArray.push(marker);
					
					//A cada 10 iterações recentraliza o mapa no ponto atual
					if( (i_mapa_real == 0) || (i_mapa_real % 7 == 0) ){
						map.setCenter({lat:parseFloat(dados[0]), lng:parseFloat(dados[1])});
					}
					i_mapa_real++;
				}
		);
	}
}

function mostraListasVendor(vendor_id){
	$.post('ajax/mostraListasVendor.php',{
				'vendor_id' : vendor_id
			},
			function(data){
				data = trim(data)
				var dados_box = '';
				var dados = data.split('{S}')
				for(var i=0;i<dados.length;i++){
					var dado = dados[i].split('|')
					var id   = dado[0] 
					var nome = dado[1]
					var foto = dado[2]
					
					if(i % 2 == 0){
						dados_box += '<label for="" class="pure-checkbox">'+
									 '<div class="tile-body nopadding">'+
									 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
									 '		<tr>'+
									 '			<td width="35">'+
									 '	 			<input id="lista_'+id+'" name="lista_'+id+'" type="checkbox">'+
									 '			</td>'+
									 '			<td width="80">'+
									 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/lista/'+foto+'" alt="Imagem da Lista">'+
									 '			</td>'+
									 '			<td>'+
									 ' 				<span onclick=checaOuDescheca("lista_'+id+'") >'+nome+'</span>'+
									 '			</td>'+
									 '		</tr>'+
									 '	</table>'+
									 '</div>'+
									 '</label>	'
					}else{
						dados_box += '<label for="" class="pure-checkbox">'+
									 '<div class="tile-body nopadding">'+
									 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
									 '		<tr>'+
									 '			<td width="35">'+
									 '	 			<input id="lista_'+id+'" name="lista_'+id+'" type="checkbox">'+
									 '			</td>'+
									 '			<td width="80">'+
									 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/lista/'+foto+'" alt="Imagem da Lista">'+
									 '			</td>'+
									 '			<td>'+
									 ' 				<span onclick=checaOuDescheca("lista_'+id+'") >'+nome+'</span>'+
									 '			</td>'+
									 '		</tr>'+
									 '	</table>'+
									 '</div>'+
									 '</label>	'


					}
					
				}
				$('#div_listas_vendor').html(dados_box)
			}
	);
}

function checaOuDescheca(id){
	if($('#'+id).prop('checked')){
		$('#'+id).prop('checked',false)
	}else{
		$('#'+id).prop('checked',true)
	}
}

function abreBoxGrupos(){
	var listas = ''
	$('#div_listas_vendor').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_lista = $(this).attr('id').split('_')
			listas += id_lista[1]+','
		}
	});	
	listas = listas.substr(0,listas.length-1);
	//alert(listas)
	
	$.post('ajax/carregaGruposPelasListas.php',{
				'listas_id': listas
			},
			function(data){
				data  = trim(data)
				
				if(data != ''){
					var dados_box = '';
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado = dados[i].split('|')
						var id   = dado[0] 
						var nome = dado[1]
						var foto = dado[2]
						
						if(i % 2 == 0){
							dados_box += '<label for="" class="pure-checkbox" style="width: 95%;margin-bottom: -26px !important;">'+
										 '<div class="tile-body nopadding">'+
										 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
										 '		<tr>'+
										 '			<td width="35">'+
										 '	 			<input id="grupovendor_'+id+'" name="grupovendor_'+id+'" type="checkbox">'+
										 '			</td>'+
										 '			<td width="80">'+
										 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/grupo/'+foto+'" alt="Imagem do Grupo">'+
										 '			</td>'+
										 '			<td>'+
										 ' 				<span onclick=checaOuDescheca("grupovendor_'+id+'") >'+nome+'</span>'+
										 '			</td>'+
										 '		</tr>'+
										 '	</table>'+
										 '</div>'+
										 '</label>	'
						}else{
							dados_box += '<label for="" class="pure-checkbox" style="width: 95%;margin-bottom: -26px !important;margin-left: -3px;">'+
										 '<div class="tile-body nopadding">'+
										 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
										 '		<tr>'+
										 '			<td width="35">'+
										 '	 			<input id="grupovendor_'+id+'" name="grupovendor_'+id+'" type="checkbox">'+
										 '			</td>'+
										 '			<td width="80">'+
										 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/grupo/'+foto+'" alt="Imagem do Grupo">'+
										 '			</td>'+
										 '			<td>'+
										 ' 				<span onclick=checaOuDescheca("grupovendor_'+id+'") >'+nome+'</span>'+
										 '			</td>'+
										 '		</tr>'+
										 '	</table>'+
										 '</div>'+
										 '</label>	'
						}
						
					}
					$('#ul_escolhe_grupos').html(dados_box)
				}else{
					$('#ul_escolhe_grupos').html('Não existem grupos vinculados a lista.')
				}
				$('#box_grupos_purple').css('display','block')
			}
	);	
}

function abreBoxUsuarios(){
	var grupos = ''
	$('#ul_escolhe_grupos').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_grupo = $(this).attr('id').split('_')
			grupos += id_grupo[1]+','
		}
	});	
	grupos = grupos.substr(0,grupos.length-1);
	
	$.post('ajax/carregaUsuariosPelosGrupos.php',{
				'grupos_id': grupos
			},
			function(data){
				data  = trim(data)
				
				if(data != '' && data.indexOf('Warning') == '-1'){
					var dados_box = '';
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado  = dados[i].split('|')
						var id    = dado[0] 
						var token = dado[1]
						var nome  = dado[2]
						var fb_id = dado[3]
						var foto  = '';
						
						if(fb_id != ''){
							foto = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
						}else if(file_exists('../loja/uploads/user_image/user_'+id+'.jpg')){
							foto = '../loja/uploads/user_image/user_'+id+'.jpg'
						}else{
							foto = 'https://graph.facebook.com//picture?type=large'
						}
						
						if(i % 2 == 0){
							dados_box += '<label for="" class="pure-checkbox" style="width: 95%;margin-bottom: -26px !important;margin-left: -3px;">'+
										 '<div class="tile-body nopadding">'+
										 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
										 '		<tr>'+
										 '			<td width="35">'+
										 '	 			<input id="usuario_'+id+'" name="usuario_'+id+'" token="'+token+'" type="checkbox" checked>'+
										 '			</td>'+
										 '			<td width="80">'+
										 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
										 '			</td>'+
										 '			<td>'+
										 ' 				<span onclick=checaOuDescheca("usuario_'+id+'") >'+nome+'</span>'+
										 '			</td>'+
										 '		</tr>'+
										 '	</table>'+
										 '</div>'+
										 '</label>	'
						}else{
							dados_box += '<label for="" class="pure-checkbox" style="width: 95%;margin-bottom: -26px !important;margin-left: -3px;">'+
										 '<div class="tile-body nopadding">'+
										 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
										 '		<tr>'+
										 '			<td width="35">'+
										 '	 			<input id="usuario_'+id+'" name="usuario_'+id+'" token="'+token+'" type="checkbox" checked>'+
										 '			</td>'+
										 '			<td width="80">'+
										 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
										 '			</td>'+
										 '			<td>'+
										 ' 				<span onclick=checaOuDescheca("usuario_'+id+'") >'+nome+'</span>'+
										 '			</td>'+
										 '		</tr>'+
										 '	</table>'+
										 '</div>'+
										 '</label>	'

						}
						
					}
					$('#ul_escolhe_usuarios').html(dados_box)
				}else{
					$('#ul_escolhe_usuarios').html('Não existem usuários vinculados a lista.')
				}
				$('#box_usuarios_black').css('display','block')
			}
	);	
}

function abreBoxAlertas(){
	$('#box_escolhe_alert_green').css('display','block')	
}

function abreModalParaEnviarMensagem(tipo){
	$('#modalAlerta').attr('ids_users_alerta','')
	var usuarios = ''
	var tokens   = ''
	$('#ul_escolhe_usuarios').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var usuario_id = $(this).attr('id').split('_')
			usuarios += usuario_id[1]+','
			tokens   += $(this).attr('token')+','
		}
	});	
	usuarios = usuarios.substr(0,usuarios.length-1);
	tokens   = tokens.substr(0,tokens.length-1);
	
	if(tipo == 'mensagem'){
		$('#modalMensagem').modal()	
		$('#modalMensagem').attr('tokens_users_mensagem',tokens)
		$('#hd_users_mensagem_web').val(usuarios)
	}else if(tipo == 'alerta'){
		$('#modalAlerta').modal()	
		$('#modalAlerta').attr('ids_users_alerta',usuarios)
		$('#modalAlerta').attr('tokens_users_alerta',tokens)
	}else{
		$('.notification_erro').html('Um tipo de alerta deve ser escolhido')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){$('.notification_erro').css('display','none')},3000);	
	}
}

function criaAlerta(){
	if(validaCamposFormulario() == '1'){
		colocaLoad()
		document.getElementById('form_cria_alerta').submit();
		verificaUploadsAlerta()
	}
}

function verificaUploadsAlerta(){
	$.post('ajax/verificaUploadsAlerta.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					$('#modalDialogCriaAlerta').modal('hide')
					$('.notification_sucesso').html('Alerta criado com sucesso!')
					$('.notification_sucesso').css('display','block')
					tiraLoad()
					window.setTimeout(function(){ window.location = 'gerenciar_alertas.php' },3000);	
				}else{
					window.setTimeout(function(){verificaUploadsAlerta()},500)
				}
			}
	);
}

function enviaAlertaDaWeb(tipo, mensagem, imagem){
	colocaLoad();
	var ids = $('#modalAlerta').attr('tokens_users_alerta').split(',')
	if(tipo.substr(0,3) == 'Pol'){
		var som_ios 	= 'www/notificacoes/amigo_roubo.mp3';  
		var som_android = 'www/notificacoes/amigo_roubo'
	}else{
		var som_ios 	= 'www/notificacoes/alerta.mp3';  
		var som_android = 'www/notificacoes/alerta'
	}
	
	$.post('ajax/gravaAlertaVendor.php',{
				'tipo'     : tipo,
				'mensagem' : mensagem,
				'imagem'   : imagem,
				'user_ids' : $('#modalAlerta').attr('ids_users_alerta')
			},
			function(data){
				$.post('https://onesignal.com/api/v1/notifications',{
							app_id			   : "f248a8c9-8f46-440f-9cc5-6c2a4d6f6c05",
							headings           : {en: 'Alerta'},
							contents           : {en: tipo},
							include_player_ids : ids,
							android_led_color  : "FF0000FF",
							ios_sound          : som_ios,
							android_sound      : som_android
						},
						function(data){
							$('#modalAlerta').modal('hide');
							$('.notification_sucesso').html('Alerta enviado com sucesso!')
							$('.notification_sucesso').css('display','block')
							tiraLoad()
							window.setTimeout(function(){ window.location = 'enviar_alertas.php' },3000);								
						}
				)
			}
	);
}

function excluiAlertaDaWeb(id){
	$.post('ajax/excluiAlertaDaWeb.php',{
				'id': id
			},
			function(data){
				$('.notification_erro').html('Alerta excluído com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'alertas_enviados.php' },3000);
			}
	);
}

function excluiAlertasDaWebEmMassa(){
	var alertas_sele = ''
	$('.tabela_alertas').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			alertas_sele += $(this).attr('id')+','
		}
	});
	alertas_sele = alertas_sele.substr(0,alertas_sele.length-1);
	if(alertas_sele != ''){
		$.post('ajax/excluiAlertasDaWebEmMassa.php',{
					'alertas_id': alertas_sele
				},
				function(data){
					$('.notification_erro').html('Alertas excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'alertas_enviados.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um alerta para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function enviaMensagemDaWeb(){
	colocaLoad()
	
	var array_users_push_id = $('#modalMensagem').attr('tokens_users_mensagem').split(',')
	
	//Que tipo de som vai fazer no push...
	if(document.getElementById('check_confirmacao').checked){
		var som_ios 	= 'www/notificacoes/msg_confirmacao.mp3';  
		var som_android = 'msg_confirmacao'
	}else{
		var som_ios 	= 'www/notificacoes/msg.mp3';  
		var som_android = 'msg'
	}
	
	//Se quiser fazer o envio do push aqui...
	$.post('https://onesignal.com/api/v1/notifications',{
				app_id			   : "f248a8c9-8f46-440f-9cc5-6c2a4d6f6c05",
				headings           : {en: 'Nova Mensagem'},
				contents           : {en: 'Você recebeu uma nova mensagem...'},
				include_player_ids : array_users_push_id,
				android_led_color  : "FF0000FF",
				ios_sound          : som_ios,
				android_sound      : som_android
			},
			function(data){
				//
			}
	)
	
	document.getElementById('form_envia_mensagem_web').submit();
	verificaUploadsMensagemWeb()
}

function excluiMensagemDaWeb(id){
	$.post('ajax/excluiMensagemDaWeb.php',{
				'id': id
			},
			function(data){
				$('.notification_erro').html('Mensagem excluída com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'alertas_enviados.php?t=1'; },3000);
			}
	);
}

function excluiMensagensDaWebEmMassa(){
	var mensagens_sele = ''
	$('.tabela_mensagens').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all2' && $(this).prop('checked') == true){
			mensagens_sele += $(this).attr('id')+','
		}
	});
	mensagens_sele = mensagens_sele.substr(0,mensagens_sele.length-1);
	if(mensagens_sele != ''){
		$.post('ajax/excluiMensagensDaWebEmMassa.php',{
					'mensagens_id': mensagens_sele
				},
				function(data){
					$('.notification_erro').html('Mensagens excluídas com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'alertas_enviados.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos uma mensagem para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function verificaUploadsMensagemWeb(){
	$.post('ajax/verificaUploadsMensagemWeb.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					$('.notification_sucesso').html('Mensagem(ns) enviada(s) com sucesso!')
					$('.notification_sucesso').css('display','block')
					tiraLoad()
					window.setTimeout(function(){ window.location = 'enviar_alertas.php' },3000);	
				}else{
					window.setTimeout(function(){verificaUploadsMensagemWeb()},500)
				}
			}
	);
}

function criaLista(){
	if(validaCamposFormulario() == '1'){
		colocaLoad()
		document.getElementById('form_cria_lista').submit();
		verificaUploadsLista()
	}
}

function verificaUploadsLista(){
	$.post('ajax/verificaUploadsLista.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					$('.notification_sucesso').html('Lista criada com sucesso!')
					$('.notification_sucesso').css('display','block')
					tiraLoad()
					window.setTimeout(function(){ window.location = 'gerenciar_listas.php' },3000);	
				}else{
					window.setTimeout(function(){verificaUploadsLista()},500)
				}
			}
	);
}

function buscaNovoGrupoLista(lista_id){
	$.post('ajax/buscaNovoGrupoLista.php',{
					'lista_id': lista_id 
			},
			function(data){
				data = trim(data)
				//alert(data)
				
				$('#modalDialogAddGrupo').attr('id_lista',lista_id)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado = dados[i].split('|')
						var id 	 = dado[0]
						var name = dado[1] 
						var foto = dado[2] 
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="grupo_'+id+'" name="'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/grupo/'+foto+'" alt="Imagem do Grupo">'+
								 '			</td>'+
								 '			<td>'+
												name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_add_grupo_lista').html(checks)
				}else{
					$('#div_add_grupo_lista').html('')	
				}
			}
	);
}

function addGrupoLista(){
	var lista_id  = $('#modalDialogAddGrupo').attr('id_lista')
	var grupos_id = ''
	$('#div_add_grupo_lista').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_grupo = $(this).attr('id').split('_')
			grupos_id += id_grupo[1]+','
		}
	});	
	grupos_id = grupos_id.substr(0,grupos_id.length-1);
	
	//alert(lista_id+' <=> '+grupos_id)
	$.post('ajax/addGrupoLista.php',{
				'lista_id'  : lista_id,
				'grupos_id' : grupos_id
			},
			function(data){
				$('.notification_sucesso').html('Grupo(s) adicionado(s) a lista com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){$('.notification_sucesso').css('display','none')},3000);
			}
	);
}

function carregaGerenciarLista(lista_id,lista_nome,lista_foto){
	$('#modalDialogGerenciarLista').attr('id_lista',lista_id)
	$('#h_nome_lista').html(lista_nome)
	$('#img_foto_lista').attr('src',lista_foto)
	$('#img_foto_lista_grande').attr('src',lista_foto)
	
	$.post('ajax/carregaGerenciarLista.php',{
					'lista_id': lista_id 
			},
			function(data){
				data = trim(data)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado = dados[i].split('|')
						var id 	 = dado[0]
						var name = dado[1]
						var foto = dado[2];
						
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="grupolista_'+id+'" name="'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="http://www.clicknalupa.com.br/loja/uploads/grupo/'+foto+'" alt="Imagem do Grupo">'+
								 '			</td>'+
								 '			<td>'+
												name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_grupos_excluir_lista').html(checks)
				}else{
					$('#div_grupos_excluir_lista').html('')	
				}
			}
	);
}

function excluiGruposLista(){
	var listas_grupos_id = ''
	$('#div_grupos_excluir_lista').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_lista_grupo = $(this).attr('id').split('_')
			listas_grupos_id += id_lista_grupo[1]+','
		}
	});	
	listas_grupos_id = listas_grupos_id.substr(0,listas_grupos_id.length-1);
	
	//alert(listas_grupos_id)
	$.post('ajax/excluiGruposLista.php',{
				'listas_grupos_id'  : listas_grupos_id
			},
			function(data){
				//$('#'+modal_abrir).modal();
				$('#modalDialogGerenciarLista').modal('hide');
				$('.notification_erro').html('Grupo(s) excluido(s) da lista com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){$('.notification_erro').css('display','none')},3000);
			}
	);
}

function excluiLista(lista_id){
	$.post('ajax/excluiLista.php',{
				'lista_id': lista_id
			},
			function(data){
				$('.notification_erro').html('Lista excluida com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'gerenciar_listas.php' },3000);
			}
	);
}

function criaGrupo(){
	if(validaCamposFormulario() == '1'){
		colocaLoad()
		document.getElementById('form_cria_grupo').submit();
		verificaUploadsGrupo()
	}
}

function verificaUploadsGrupo(){
	$.post('ajax/verificaUploadsGrupo.php',
			function(data){
				data = trim(data)
				if(data == '1'){
					$('.notification_sucesso').html('Grupo criado com sucesso!')
					$('.notification_sucesso').css('display','block')
					tiraLoad()
					window.setTimeout(function(){ window.location = 'gerenciar_grupos.php' },3000);	
				}else{
					window.setTimeout(function(){verificaUploadsGrupo()},500)
				}
			}
	);
}

function buscaNovoUsuarioGrupo(grupo_id){
	$.post('ajax/buscaNovoUsuarioGrupo.php',{
					'grupo_id': grupo_id 
			},
			function(data){
				data = trim(data)
				//alert(data)
				
				$('#modalDialogAddUsuario').attr('id_grupo',grupo_id)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado  = dados[i].split('|')
						var id 	  = dado[0]
						var name  = dado[1] 
						var fb_id = dado[2]
						var foto  = '';
						
						if(fb_id != ''){
							foto = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
						}else if(file_exists('../loja/uploads/user_image/user_'+id+'.jpg')){
							foto = '../loja/uploads/user_image/user_'+id+'.jpg'
						}else{
							foto = 'https://graph.facebook.com//picture?type=large'
						}
						
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="usuario_'+id+'" name="'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
								 '			</td>'+
								 '			<td>'+
												name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_add_usuario_grupo').html(checks)
				}else{
					$('#div_add_usuario_grupo').html('')	
				}
			}
	);
}

function addUsuarioGrupo(){
	var grupo_id  = $('#modalDialogAddUsuario').attr('id_grupo')
	var usuarios_id = ''
	$('#div_add_usuario_grupo').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_usuario = $(this).attr('id').split('_')
			usuarios_id += id_usuario[1]+','
		}
	});	
	usuarios_id = usuarios_id.substr(0,usuarios_id.length-1);
	
	$.post('ajax/addUserGrupo.php',{
				'grupo_id' : grupo_id,
				'users_id' : usuarios_id
			},
			function(data){
				$('.notification_sucesso').html('Usuário(s) adicionado(s) ao grupo com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){$('.notification_sucesso').css('display','none')},3000);
			}
	);
}

function excluiGrupo(grupo_id){
	$.post('ajax/excluiGrupo.php',{
				'grupo_id': grupo_id
			},
			function(data){
				$('.notification_erro').html('Grupo excluido com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'gerenciar_grupos.php' },3000);
			}
	);
}

function carregaGerenciarGrupo(grupo_id,grupo_nome,grupo_foto){
	if(grupo_foto[grupo_foto.length-1] == '/'){
		grupo_foto = "http://www.clicknalupa.com.br/cnls_admin/images/sem-foto.gif"	
	}
	$('#modalDialogGerenciarGrupo').attr('id_grupo',grupo_id)
	$('#h_nome_grupo').html(grupo_nome)
	$('#img_foto_grupo').attr('src',grupo_foto)
	$('#img_foto_grupo_grande').attr('src',grupo_foto)
	
	$.post('ajax/carregaGerenciarGrupo.php',{
					'grupo_id': grupo_id 
			},
			function(data){
				data = trim(data)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado    = dados[i].split('|')
						var id 	    = dado[0]
						var name    = dado[1] 
						var fb_id   = dado[2]
						var user_id = dado[3]
						var foto  = '';
						
						if(fb_id != ''){
							foto = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
						}else if(file_exists('../loja/uploads/user_image/user_'+user_id+'.jpg')){
							foto = '../loja/uploads/user_image/user_'+user_id+'.jpg'
						}else{
							foto = 'https://graph.facebook.com//picture?type=large'
						}
						
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important; margin-bottom: -6px !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="usergrupo_'+id+'" name="usergrupo'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
								 '			</td>'+
								 '			<td>'+
								  				name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_usuarios_excluir_grupo').html(checks)
				}else{
					$('#div_usuarios_excluir_grupo').html('')	
				}
			}
	);
}

function excluiUsuariosGrupo(){
	var grupos_usuarios_id = ''
	$('#div_usuarios_excluir_grupo').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_grupo_usuario = $(this).attr('id').split('_')
			grupos_usuarios_id += id_grupo_usuario[1]+','
		}
	});	
	grupos_usuarios_id = grupos_usuarios_id.substr(0,grupos_usuarios_id.length-1);
	
	$.post('ajax/excluiUsuariosGrupo.php',{
				'grupos_usuarios_id'  : grupos_usuarios_id
			},
			function(data){
				//$('#'+modal_abrir).modal();
				$('#modalDialogGerenciarGrupo').modal('hide');
				$('.notification_erro').html('Usuário(s) excluido(s) do grupo com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){$('.notification_erro').css('display','none')},3000);
			}
	);
}

function listaAlertasDaWeb(valor){
	$.post('ajax/listaAlertasDaWeb.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_alertas').html(data)
			}
	);
}

function listaMensagensDaWeb(valor){
	$.post('ajax/listaMensagensDaWeb.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_mensagens').html(data)
			}
	);
}

function excluiListasEmMassa(){
	var listas_sele = ''
	$('.tabela_listas').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			listas_sele += $(this).attr('id')+','
		}
	});
	listas_sele = listas_sele.substr(0,listas_sele.length-1);
	
	if(listas_sele != ''){
		$.post('ajax/excluiListasEmMassa.php',{
					'listas_id': listas_sele
				},
				function(data){
					$('.notification_erro').html('Listas excluidas com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_listas.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos uma lista para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function excluiGruposEmMassa(){
	var grupos_sele = ''
	$('.tabela_grupos').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			grupos_sele += $(this).attr('id')+','
		}
	});
	grupos_sele = grupos_sele.substr(0,grupos_sele.length-1);
	if(grupos_sele != ''){
		$.post('ajax/excluiGruposEmMassa.php',{
					'grupos_id': grupos_sele
				},
				function(data){
					$('.notification_erro').html('Grupos excluidos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_grupos.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos uma lista para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function excluiAlerta(alerta_id){
	$.post('ajax/excluiAlerta.php',{
				'alerta_id': alerta_id
			},
			function(data){
				$('.notification_erro').html('Alerta excluído com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'gerenciar_alertas.php' },3000);
			}
	);
}

function excluiAlertasEmMassa(){
	var alertas_sele = ''
	$('.tabela_alertas').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			alertas_sele += $(this).attr('id')+','
		}
	});
	alertas_sele = alertas_sele.substr(0,alertas_sele.length-1);
	
	if(alertas_sele != ''){
		$.post('ajax/excluiAlertasEmMassa.php',{
					'alertas_id': alertas_sele
				},
				function(data){
					$('.notification_erro').html('Alertas excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_alertas.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um alerta para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function listaAlertas(valor){
	$.post('ajax/listaAlertas.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_alertas').html(data)
			}
	);
}

function listaListas(valor){
	$.post('ajax/listaListas.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_listas').html(data)
			}
	);
}

function listaGrupos(valor){
	$.post('ajax/listaGrupos.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_grupos').html(data)
			}
	);
}

var mapa_status_ponto;
var pontosMapaStatus = [];
function buscaPontoMapaStatus(){
	$.post('ajax/buscaPontoMapaStatus.php',{
				'endereco' :  $('#s_endereco').val(),
				'cep' 	   :  $('#s_cep').val()
			},
			function(data){
				data = trim(data);
				if(data == '-1'){
					alert('Não foi possível atualizar o mapa. Endereço e/ou CEP inválido(s)!')
				}else{
					if(data.indexOf('Warning') != '-1'){
						alert('Não foi possível atualizar o mapa. Endereço e/ou CEP inválido(s)!')
					}else{
						var lat_long = data.split('|')
						var lat      = lat_long[0]
						var long     = lat_long[1]
						
						$('#s_lat').val(lat)
						$('#s_long').val(long)
						
						limpaPontosMapaStatus()
						
						var mapOptions = {
							  center: new google.maps.LatLng(lat,long),
							  zoom: 17,
							  mapTypeId: google.maps.MapTypeId.ROADMAP
							}
						mapa_status_ponto = new google.maps.Map(document.getElementById('mapa_status_ponto'), mapOptions);
						
						var lat_long = new google.maps.LatLng(lat,long);
						var marker = new google.maps.Marker({
								 map: mapa_status_ponto,
								 position: lat_long
							 });
						//Coloca a marker no array de markers
						pontosMapaStatus.push(marker);
					}
				}
			}
	)
}

//Funcao que limpa os pontos do mapa
function limpaPontosMapaStatus(){
	for (var i = 0; i < pontosMapaStatus.length; i++ ) {
		pontosMapaStatus[i].setMap(null);
	}
	pontosMapaStatus = [];
}


function gravaStatusPontoEndereco(){
	colocaLoad();
	$.post('ajax/gravaStatusPontoEndereco.php',{
				'contato'  :  $('#s_contato').val(),
				'empresa'  :  $('#s_empresa').val(),
				'telefone' :  $('#s_telefone').val(),
				'endereco' :  $('#s_endereco').val(),
				'cep' 	   :  $('#s_cep').val(),
				'lat' 	   :  $('#s_lat').val(),
				'long' 	   :  $('#s_long').val(),
				'id' 	   :  $('#hd_id').val()
			},
			function(data){
				tiraLoad();
				data = trim(data);
				if(data == '-1'){
					$('.notification_erro').html('Endereço e/ou CEP inválido(s)! O endereço não foi gravado.')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
				}else if(data == 'INS'){
					$('.notification_sucesso').html('Endereço cadastrado com sucesso!')
					$('.notification_sucesso').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
				}else{
					$('.notification_alert').html('Endereço atualizado com sucesso!')
					$('.notification_alert').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
				}
			}
	)
}

function listaStatusPontoEndereco(valor){
	$.post('ajax/listaStatusPontoEndereco.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				$('#listagem_status_enderecos').html(data)
			}
	);
}

function excluiStatusPontoEndereco(ponto_endereco_id){
	$.post('ajax/excluiStatusPontoEndereco.php',{
				'ponto_endereco_id': ponto_endereco_id
			},
			function(data){
				$('.notification_erro').html('Endereço excluído com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
			}
	);
}

function excluiStatusPontoEnderecoEmMassa(){
	var pontos_sele = ''
	$('.tabela_status_enderecos').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			pontos_sele += $(this).attr('id')+','
		}
	});
	pontos_sele = pontos_sele.substr(0,pontos_sele.length-1);
	if(pontos_sele != ''){
		$.post('ajax/excluiStatusPontoEnderecoEmMassa.php',{
					'pontos_id': pontos_sele
				},
				function(data){
					$('.notification_erro').html('Endereços excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um endereço para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function desabilitaStatusPontoEndereco(ponto_endereco_id,acao){	
	if(acao == 'desabilitar'){
		var status = '-1'	
	}else{
		var status = '1'	
	}
	$.post('ajax/desabilitaStatusPontoEndereco.php',{
				'ponto_endereco_id': ponto_endereco_id,
				'status'		   : status
			},
			function(data){
				if(acao == 'desabilitar'){
					$('.notification_erro').html('Endereço desabilitado com sucesso!')
					$('.notification_erro').css('display','block')
					
				}else{
					$('.notification_sucesso').html('Endereço habilitado com sucesso!')	
					$('.notification_sucesso').css('display','block')
				}
				window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
			}
	);
}

function carregaDadosAtualizarStatusPontoEndereco(id,contato,empresa,telefone,endereco,cep,lat,long){
	$('#s_contato').val(contato),
	$('#s_empresa').val(empresa),
	$('#s_telefone').val(telefone),
	$('#s_endereco').val(endereco),
	$('#s_cep').val(cep),
	$('#s_lat').val(lat),
	$('#s_long').val(long)
	$('#hd_id').val(id)
	
	limpaPontosMapaStatus()
						
	window.setTimeout(function(){
		var mapOptions = {
			  center: new google.maps.LatLng(lat,long),
			  zoom: 17,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		mapa_status_ponto = new google.maps.Map(document.getElementById('mapa_status_ponto'), mapOptions);
		
		var lat_long = new google.maps.LatLng(lat,long);
		var marker = new google.maps.Marker({
				 map: mapa_status_ponto,
				 position: lat_long
			 });
		//Coloca a marker no array de markers
		pontosMapaStatus.push(marker);
	},800);
}

function buscaNovoUsuarioVinculo(ponto_id){
	$.post('ajax/buscaNovoUsuarioVinculo.php',{
					'ponto_id': ponto_id 
			},
			function(data){
				data = trim(data)
				
				$('#modalDialogVincularUsuario').attr('id_ponto',ponto_id)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado  = dados[i].split('|')
						var id 	  = dado[0]
						var name  = dado[1] 
						var fb_id = dado[2]
						var foto  = '';
						
						if(fb_id != ''){
							foto = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
						}else if(file_exists('../loja/uploads/user_image/user_'+id+'.jpg')){
							foto = '../loja/uploads/user_image/user_'+id+'.jpg'
						}else{
							foto = 'https://graph.facebook.com//picture?type=large'
						}
						
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="usuario_'+id+'" name="'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
								 '			</td>'+
								 '			<td>'+
												name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_vincular_usuario').html(checks)
				}else{
					$('#div_vincular_usuario').html('')	
				}
			}
	);
}

function vincularUsuarioStatusPonto(){
	var ponto_id    = $('#modalDialogVincularUsuario').attr('id_ponto')
	var usuarios_id = ''
	$('#div_vincular_usuario').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_usuario = $(this).attr('id').split('_')
			usuarios_id += id_usuario[1]+','
		}
	});	
	usuarios_id = usuarios_id.substr(0,usuarios_id.length-1);
	
	$.post('ajax/vincularUsuario.php',{
				'ponto_id' : ponto_id,
				'users_id' : usuarios_id
			},
			function(data){
				$('.notification_sucesso').html('Usuário(s) vinculado(s) com sucesso!')
				$('.notification_sucesso').css('display','block')
				window.setTimeout(function(){$('.notification_sucesso').css('display','none')},3000);
			}
	);
}

function carregaGerenciarPonto(ponto_id){
	$('#modalDialogGerenciarVinculo').attr('id_ponto',ponto_id)
	
	$.post('ajax/carregaGerenciarPonto.php',{
					'ponto_id': ponto_id 
			},
			function(data){
				data = trim(data)
				if(data != ''){
					var checks = ''
					var dados = data.split('{S}')
					for(var i=0;i<dados.length;i++){
						var dado    = dados[i].split('|')
						var id 	    = dado[0]
						var name    = dado[1] 
						var fb_id   = dado[2]
						var user_id = dado[3]
						var foto  = '';
						
						if(fb_id != ''){
							foto = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
						}else if(file_exists('../loja/uploads/user_image/user_'+user_id+'.jpg')){
							foto = '../loja/uploads/user_image/user_'+user_id+'.jpg'
						}else{
							foto = 'https://graph.facebook.com//picture?type=large'
						}
						
						checks+= '<label for="" class="pure-checkbox">'+
								 '<div class="tile-body nopadding">'+
								 '	<table id="demo-table" class="table table-bordered" style="height: auto !important; margin-bottom: -6px !important;">'+
								 '		<tr>'+
								 '			<td width="35">'+
								 '	 			<input id="vinculo_'+id+'" name="vinculo'+id+'" type="checkbox"">'+
								 '			</td>'+
								 '			<td width="80">'+
								 ' 				<img src="'+foto+'" alt="Imagem do Usuário">'+
								 '			</td>'+
								 '			<td>'+
								  				name +
								 '			</td>'+
								 '		</tr>'+
								 '	</table>'+
								 '</div>'+
								 '</label>	'
					}
					$('#div_usuarios_excluir_vinculo').html(checks)
				}else{
					$('#div_usuarios_excluir_vinculo').html('')	
				}
			}
	);
}

function excluiUsuariosVinculo(){
	var vinculos_usuarios_id = ''
	$('#div_usuarios_excluir_vinculo').find('input[type=checkbox]').each(function(){
		if($(this).prop('checked')){
			var id_vinculo_usuario = $(this).attr('id').split('_')
			vinculos_usuarios_id += id_vinculo_usuario[1]+','
		}
	});	
	vinculos_usuarios_id = vinculos_usuarios_id.substr(0,vinculos_usuarios_id.length-1);
	
	$.post('ajax/excluiUsuariosVinculo.php',{
				'vinculos_usuarios_id'  : vinculos_usuarios_id
			},
			function(data){
				//$('#'+modal_abrir).modal();
				$('#modalDialogGerenciarVinculo').modal('hide');
				$('.notification_erro').html('Usuário(s) desvinculado(s) com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){$('.notification_erro').css('display','none')},3000);
			}
	);
}

function marcaPontosMapaVinculos(){
	var dados_mapa = $('#hd_pontos_mapa').val()
	//Limpa o array de markers
	var markers    	 		= [];
	var nomes      	 		= [];
	var imagens      		= [];
	var foto_users   		= [];
	var ids 	     		= [];
	markers.length   		= 0
	
	//Os dois decodificam o JSON
	//var dados = JSON.parse(dados_mapa);
	var dados_map  = dados_mapa.split('{S}')
	var infowindow = new google.maps.InfoWindow(), marker, i;
	var foi = 0;
	for(var i=0;i<dados_map.length;i++){
		dados         		= dados_map[i].split('|')
		var lat  	  		= dados[0]
		var long 	  		= dados[1]
		nomes[i]      		= dados[2]
		imagens[i]    		=  'http://www.clicknalupa.com.br/loja/uploads/panico/pino-mapa.png'
		
		var fb_id = dados[3];
		if(fb_id != ''){
			foto_users[i] = 'https://graph.facebook.com/'+fb_id+'/picture?type=large'
		}else if(file_exists('../loja/uploads/user_image/user_'+dados[4]+'.jpg')){
			foto_users[i] = '../loja/uploads/user_image/user_'+dados[4]+'.jpg'
		}else{
			foto_users[i] = 'https://graph.facebook.com//picture?type=large'
		}
		ids[i]        		= dados[4]
		foi++;
		if(foi=='1'){
			//Inicializa o mapa
			var mapOptions = {
			  center: new google.maps.LatLng(lat,long),
			  zoom: 7,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
		}
					
		//var image = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
		var image = imagens[i];
		var lat_long = new google.maps.LatLng(lat,long);
		
		
		//Check Markers array for duplicate position and offset a little
		if(markers.length != 0) {
			for (i=0; i < markers.length; i++) {
				var existingMarker = markers[i];
				var pos = existingMarker.getPosition();
				if (lat_long.equals(pos)) {
					var a = 360.0 / markers.length;
					var newLat = pos.lat() + -.00004 * Math.cos((+a*i) / 180 * Math.PI);  //x
					var newLng = pos.lng() + -.00002 * Math.sin((+a*i) / 180 * Math.PI);  //Y
					var lat_long = new google.maps.LatLng(newLat,newLng);
				}
			}
		}
		
		var marker = new google.maps.Marker({
							 map: map,
							 title: nomes[i],
							 position: lat_long,
							 icon:image
						 });
		//Coloca a marker no array de markers
		markers.push(marker);
	}
	
	//Troca o icone e a cor do texto do ícone
	var clusterStyles = [
						  {
							textColor: 'black',
							url: 'http://www.clicknalupa.com.br/loja/uploads/others/icon_marker_cluster.png',
							height: 50,
							width: 50
						  }
						];
	
	var mcOptions = {gridSize: 50,styles: clusterStyles, maxZoom: 15};
	var mc = new MarkerClusterer(map, markers, mcOptions);
	for(var p=0;p<markers.length;p++){
		var marker = markers[p];
		google.maps.event.addListener(marker, 'click', (function(marker, p) {
				 return function() {
					infowindow.setContent('<div class="mapa_ponto">'+
												'<table>'+
													'<tr>'+
														'<td><img width="100" height="100" src="'+foto_users[p]+'"/></td>'+
													'</tr>'+
													'<tr>'+
														'<td style="padding-top:10px"><b>Usuário:</b>&nbsp;'+nomes[p]+'</td>'+
													'</tr>'+
												'</table>'+
										   '</div>');			
					infowindow.open(map, marker);
				}
			})(marker, p));
	}
}

function listaAtividades(valor){
	$.post('ajax/listaAtividades.php',{
				'valor': valor
			},
			function(data){
				data = trim(data)
				var dados = data.split('{SEPARADOR}')
				$('#listagem_atividades').html(dados[0])
				$('#hd_pontos_mapa').val(dados[1])
			}
	);
}

function excluiStatusPontoEndereco(ponto_endereco_id){
	$.post('ajax/excluiStatusPontoEndereco.php',{
				'ponto_endereco_id': ponto_endereco_id
			},
			function(data){
				$('.notification_erro').html('Endereço excluído com sucesso!')
				$('.notification_erro').css('display','block')
				window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
			}
	);
}

function excluiStatusPontoEnderecoEmMassa(){
	var pontos_sele = ''
	$('.tabela_status_enderecos').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			pontos_sele += $(this).attr('id')+','
		}
	});
	pontos_sele = pontos_sele.substr(0,pontos_sele.length-1);
	if(pontos_sele != ''){
		$.post('ajax/excluiStatusPontoEnderecoEmMassa.php',{
					'pontos_id': pontos_sele
				},
				function(data){
					$('.notification_erro').html('Endereços excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'gerenciar_pontos.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos um endereço para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

var markersRealUserArray = [];
var i_mapa_real_user     = 0;
var interval_mapa_real_user;
//Funcao que limpa os pontos do mapa
function limpaPontosMapaRealUser() {
	for (var i = 0; i < markersRealUserArray.length; i++ ) {
		markersRealUserArray[i].setMap(null);
	}
	markersRealUserArray = [];
}

function mapaUsuarioTempoReal(id_mapa,lat,long,user_id,inicio){
	if(inicio == '1'){
		limpaPontosMapaRealUser()
		i_mapa_real_user = 0;
		window.setTimeout(function(){ 
			$.post('ajax/pegaLatLongTempoReal.php',{
						'user_id': user_id 
					},	
					function(data){
						limpaPontosMapaRealUser()
						data = trim(data)
						var dados = data.split('|')
						
						var mapOptions = {
							  center: new google.maps.LatLng(dados[0],dados[1]),
							  zoom: 17,
							  mapTypeId: google.maps.MapTypeId.ROADMAP
							}
							map = new google.maps.Map(document.getElementById('div_mapa_real_user'+id_mapa), mapOptions);	
							
							var marker= new google.maps.Marker({
												position:new google.maps.LatLng(dados[0],dados[1])
											});
												
							marker.setMap(map);
							markersRealUserArray.push(marker);
							
							//Chama a cada 2 segundos
							interval_mapa_real_user = setInterval(function(){mapaUsuarioTempoReal(id_mapa,lat,long,user_id,'0')},2000)
					}
			);
		},500);
	}else{
		$.post('ajax/pegaLatLongTempoReal.php',{
					'user_id': user_id 
				},	
				function(data){
					limpaPontosMapaRealUser()
					var dados = data.split('|')
					var marker=new google.maps.Marker({
							position:new google.maps.LatLng(dados[0],dados[1])
						});
							
					marker.setMap(map);		
					markersRealUserArray.push(marker);
					
					//A cada 10 iterações recentraliza o mapa no ponto atual
					if( (i_mapa_real_user == 0) || (i_mapa_real_user % 7 == 0) ){
						map.setCenter({lat:parseFloat(dados[0]), lng:parseFloat(dados[1])});
					}
					i_mapa_real_user++;
				}
		);
	}
}

function excluiAtividadesEmMassa(){
	var at_sele = ''
	$('.tabela_atividades').find('input[type=checkbox]').each(function(){
		//Pega os valores q não sejam da coluna de checkbox
		if($(this).attr('id') != 'check_all' && $(this).prop('checked') == true){
			at_sele += $(this).attr('id')+','
		}
	});
	at_sele = at_sele.substr(0,at_sele.length-1);
	if(at_sele != ''){
		$.post('ajax/excluiAtividadesEmMassa.php',{
					'atividades_id': at_sele
				},
				function(data){
					$('.notification_erro').html('Usuários vinculados excluídos com sucesso!')
					$('.notification_erro').css('display','block')
					window.setTimeout(function(){ window.location = 'registro_atividades02.php' },3000);
				}
		);
	}else{
		$('.notification_erro').html('É necessário escolher ao menos uma linha para excluir.')
		$('.notification_erro').css('display','block')
		window.setTimeout(function(){ $('.notification_erro').css('display','none') },3000);
	}
}

function trocaTelaInicioAPP(id,tela){
	$.post('ajax/trocaTelaInicioAPP.php',{
				'id'  : id,
				'tela': tela
			},
			function(data){
				$('.notification_alert').html('Tela inicial do APP alterada com sucesso!')
				$('.notification_alert').css('display','block')
				window.setTimeout(function(){ window.location = 'usuarios_dependentes.php' },3000);
			}
	);	
}



//Auxiliares
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}

function file_exists(url){
  // http://kevin.vanzonneveld.net
  // +   original by: Enrique Gonzalez
  // +      input by: Jani Hartikainen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.
  // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.
  // *     example 1: file_exists('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
  // *     returns 1: '123'
  var req = this.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
  if (!req) {
    throw new Error('XMLHttpRequest not supported');
  }

  // HEAD Results are usually shorter (faster) than GET
  req.open('HEAD', url, false);
  req.send(null);
  if (req.status == 200) {
    return true;
  }

  return false;
}
