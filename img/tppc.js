		$(document).ready(function(){
			getBattleStatus();
			
		});
		
		function smallResolution(){
			$('#Trainer1_Active','#Trainer2_Active','#Trainer1_Pokemon','#Trainer2_Pokemon').each(
				function(){
					$(this).css('width','295px');
					$(this).find('A').css('fontSize', '0.6em');
				}
			);
		}
		function getBattleStatus(getVars){
			if ($('#battleWindow').length == 0) return false;
			
			if (_gaq)
				_gaq.push(['_trackPageview', '/battle.php']);
			if ($('tAoDp1')){
				$('tAoDp1').src = $('tAoDp1').src;
			}
			if ($('tAoDp2')){
				$('tAoDp2').src = $('tAoDp2').src;
			}
			
			if (!getVars) getVars = {};
			if (!getVars['Battle'] && ($('#Battle').length > 0))
				getVars['Battle'] = $('#Battle').val();
			if (!getVars['BattleID'] && ($('#BattleID').length > 0))
				getVars['BattleID'] = $('#BattleID').val();
			if (!getVars['Trainer'] && ($('#Trainer').length > 0))
				getVars['Trainer'] = $('#Trainer').val();
			
			if ($('#MoveBox').length > 0){
				statusNote($('#MoveBox'), 'Loading...');
			}
			
			$.ajax({
				type: 'GET',
				url: 'http://tppcrpg.net/battle.v8.handler.php?' + $.param(getVars) + '&Rand=' + (Math.random()*10000),
				error: function(jqXHR, textStatus, errorThrown){
					var BW = $('#battleWindow');
					BW.empty();
					
					BW.append('<DIV class="error">An error occurred and the current battle status could not be retrieved.</DIV>');
					
					return false;
				},
				success: function(data, textStatus, jqXHR){
					var BW = $('#battleWindow');
					BW.empty();
					
					var error = $(data).find('error');
					var root = $(data).children('root');
					if (error.length > 0){
						BW.append($('<DIV class="error"><STRONG>Error:</STRONG> ' + error.eq(0).text() + '</DIV>'));
					} else if (root.length == 1){
						
						
						BW.append($('<DIV id="ActiveBoxes"><DIV id="Trainer1_Active" /><DIV id="Trainer2_Active" /></DIV>'));
						BW.append($('<UL id="battleText" /><DIV id="MoveBox" />'));
						BW.append($('<DIV id="RosterBoxes"><DIV id="Trainer1_Pokemon" /><DIV id="Trainer2_Pokemon" /></DIV>'));
						BW.append($('<DIV id="cancelBattle" /><DIV id="bW_Bottom">&nbsp;</DIV>'));
						
						
						if (screen.width < 1280){
							smallResolution();
						}
						
						renderBattle(root.eq(0));
						
					} else {
						BW.append($('<DIV class="error">An error has occurred when reading the battle status. Please leave this battle and start over.</DIV>'));
						// add Leave Battle
					}
					
				}
			});
			
		}
		
		function statusNote(par, txt, timestamp){
			if (par){
				par.empty();
				var mB = $('<DIV />').addClass('loading').addClass('notice');
				mB.append($('<IMG src="http://tppcrpg.net/graphics/runner.gif" />').attr({ alt: txt, title: txt }));
				mB.append(txt);
				if (timestamp){
					mB.append($('<BR /><SMALL>Last Update: ' + timestamp + '</SMALL>'));
					
				}
				par.append(mB);
			}
			
			$('#Trainer1_Pokemon a, #Trainer2_Pokemon a').each(function(){
				$(this).replaceWith($('<SPAN>' + $(this).text() + '</SPAN>'));
			});
			
			$('#cancelBattle').empty();
		}
		
		function renderText(Par, Text, Trainer1, Trainer2){
			if (!Trainer1) Trainer1 = 0;
			if (!Trainer2) Trainer2 = 0;
			
			Trainer1 = Trainer1 + '|';
			Trainer2 = Trainer2 + '|';
			
			var TextNode, li;
			for (var i = 0; i < Text.length; i++){
				
				TextNode = Text.eq(i).text();
				
				li = $('<LI />');
				
				if (Trainer1 == TextNode.substring(0, Trainer1.length)){
					li.addClass('Trainer1');
					TextNode = TextNode.substring(Trainer1.length);
				} else if (Trainer2 == TextNode.substring(0, Trainer2.length)){
					li.addClass('Trainer2');
					TextNode = TextNode.substring(Trainer2.length);
				}
				
				li.append(TextNode);
				
				Par.append(li);
				
			}
		}
		
		function renderStarter(Par, Poke, Trainer){
			if (!Trainer) Trainer = 'Trainer';

			Par.addClass('battleBox');
			
			var PokeName = Poke.text();
			
			Par.append($('<DIV class="headerBar">' + Trainer + '\'s ' + PokeName + '</DIV>'));
			
			var iC = $('<DIV class="innerContent"><IMG class="PokeImage" src="http://tppcrpg.net/' + Poke.attr('Image') + '" title="' + PokeName + '" alt="' + PokeName + '" /></DIV>');
			
			if (Poke.attr('offField') && (Poke.attr('offField') == '1')){
				Par.find('.PokeImage').css('display', 'none');
			}
			
			var fs = $('<FIELDSET><LEGEND>HP:</LEGEND></FIELDSET>');
			if (Poke.attr('Status') && (Poke.attr('Status') != ''))
				fs.children('LEGEND').append('<IMG class="PokeStatus" src="http://graphics.tppcrpg.net/status/' + Poke.attr('Status') + '.png" alt="' + Poke.attr('Status') + '" title="' + Poke.attr('Status') + '" />');
			
			var cHP = (Poke.attr('CurrentHP')) ? Poke.attr('CurrentHP') : 0;
			var oHP = (Poke.attr('OriginalHP')) ? Poke.attr('OriginalHP') : 1;
				
			var calcPercentage = Math.round((cHP / oHP) * 100);
			if ((calcPercentage == 0) && (cHP > 0)) calcPercentage = 1;
			
			fs.append($('<DIV class="hpBar" title="' + calcPercentage + '% HP Remaining">|</DIV>').css('width', calcPercentage + '%'));
			
			iC.append(fs);
			
			if (Poke.attr('Item') && (Poke.attr('Item') != '')){
				iC.append($('<DIV class="item"><STRONG>Item: </STRONG>' + Poke.attr('Item') + '</DIV>'));
			}
			
			
			Par.append(iC);
			
			
			
		}
		
		function renderPokemonListing(Par, List, Active, switchLinks){
			if (!switchLinks) switchLinks = false;
			Par.addClass('rosterBox');
			
			Par.append('<DIV class="headerBar">Roster</DIV>');
			
			var ul = $('<UL class="rosterContent" />');
			
			var row, PokeName, cHP, oHP, calcPercentage, hpBar, PokeNum;
			
			for (var i = 0; i < List.length; i++){
				row = $('<LI class="row' + (i & 1) + '" />');
				
				PokeName = List.eq(i).text();
				
				
				cHP = (List.eq(i).attr('CurrentHP')) ? List.eq(i).attr('CurrentHP') : 0;
				oHP = (List.eq(i).attr('OriginalHP')) ? List.eq(i).attr('OriginalHP') : 0;
				Lvl = (List.eq(i).attr('Level')) ? List.eq(i).attr('Level') : '???';
				PokeNum = (List.eq(i).attr('PokeNum')) ? List.eq(i).attr('PokeNum') : '000';
				
				calcPercentage = Math.round((cHP / oHP) * 100);
				
				var hpBar = $('<DIV class="hpBar"></DIV>');
				
				hpBar.append($('<DIV class="hpVal">|</DIV>').css('width', calcPercentage + '%'));
				
				row.append(hpBar);
				
				row.append($('<IMG class="mini" src="http://graphics.tppcrpg.net/mini/' + PokeNum + '.gif" alt="' + PokeName + '" title="' + PokeName + '" />'));
				
				
				if (!switchLinks || (cHP == 0) || (List.eq(i).attr('id') == Active.attr('id')))
					row.append(PokeName);
				else {
					var sL = $('<A href="#" slot="' + i + '">' + PokeName + '</A>');
					
					sL.click(function(e){

						getBattleStatus({ MyMove: 'S' + $(this).attr('slot'), pageID: e.pageX + "." + e.pageY });
					});
					row.append(sL);
				}
				
				row.append($('<SMALL>&nbsp;(L:' + Lvl + ')</SMALL>'));
				
				if (List.eq(i).attr('Status') && (List.eq(i).attr('Status') != ''))
					row.append('<IMG class="PokeStatus" src="http://graphics.tppcrpg.net/status/' + List.eq(i).attr('Status') + '.png" alt="' + List.eq(i).attr('Status') + '" title="' + List.eq(i).attr('Status') + '" />');
				
				
				ul.append(row);
			}
			
			Par.append(ul);
			
			return; 
		}
		
		
		function renderWait(Trainer, BattleType){

			var p = $('<SPAN class="Trainer' + Trainer + '">Your opponent\'s Pokemon has fainted!</SPAN>');
			p.append($('<BR /><BR />'));
				
			// allow switch on faint
			$('#Trainer1_Pokemon a, #Trainer2_Pokemon a').each(function(){
				$(this).click(function(e){
					getBattleStatus({ MyMove: 'WaitFaint' + $(this).attr('slot'), pageID: e.pageX + "." + e.pageY });
				})
			});
				
			var input = $('<INPUT type="button" class="submit" value="Continue >>" />').click(function(e){
				$(this).attr('disabled', 'disabled');
				getBattleStatus({ MyMove: 'WaitFaint', pageID: e.pageX + "." + e.pageY });
			});
				
			p.append(input);
			p.append($('<BR /><BR />'));
			p.append('Please choose continue or switch to another Pokemon!');
							
			$('#MoveBox').append(p);
		}
		
		function renderMoves(Moves, Starter, Trainer){
			Starter = Starter.text();
			var mB = $('#MoveBox');
			
			if (!Moves || Moves.length == 0){
				mB.append($('<SPAN>Please choose your next Pokemon!</SPAN>').addClass('Trainer' + Trainer));
			} else {
				
				
				
				var p = $('<SPAN class="Trainer' + Trainer + '">Please select a move:</SPAN>');
				p.append($('<BR />'));
				
				var select = $('<SELECT id="MyMove" name="MyMove"></SELECT>');
				
				var MoveName, opt;
				for (var i = 0; i < Moves.length; i++){
					MoveName = Moves.eq(i).text();
					if (MoveName == '') continue;
					
					
					opt = $('<OPTION value="' + Moves.eq(i).attr('id') + '">' + MoveName + '</OPTION>');
					
					if (Moves.eq(i).attr('LM') && (Moves.eq(i).attr('LM') == '1'))
						opt.attr('selected', 'selected');
					
					select.append(opt);
					
				}

				p.append(select);
				p.append('<BR />');
				
				var extraSpaces = Math.ceil(Math.random() * 8);
				var buttonText = 'Attack Me!';
				for (var es = 0; es < extraSpaces; es++){
					buttonText = ' ' + buttonText + ' ';
				}
				
				var submit = $('<INPUT class="submit" type="button" value="' + buttonText + '" />').css({ width: '100px', whiteSpace: 'pre-line' });
				submit.click(function(e){
					getBattleStatus({ MyMove: $('#MyMove').val(), pageID: e.pageX + "." + e.pageY });
				});
				p.append(submit);
				
				mB.append(p);
				
				
			}
			
		}
		
		function renderBattle(xml){
			var BW = $('#battleWindow');
			var Battle = xml.find('Battle');
			if (Battle.length == 1){
				Battle = Battle.eq(0);
				var BattleType = Battle.attr('Type');
				if (Battle.attr('Condition')){
					$('ActiveBoxes').css('background','url(http://graphics.tppcrpg.net/weather/' + Battle.attr('Condition') + '.png) no-repeat center -30px');
				} else $('ActiveBoxes').css('background', 'none');
				
				var BattleID = (Battle.attr('id')) ? Battle.attr('id') : '';
				
				if (Battle.attr('MovesRestricted') && (Battle.attr('MovesRestricted') == 1)){
					BW.prepend($('<DIV class="notice header">Not all moves can be used in all battles. Moves that allow your Pokemon to heal, return double damage, and knock out your opponent in one hit cannot be used and have been removed from your moves list.</DIV>'));
				} else if (Battle.attr('MovesRestricted') && (Battle.attr('MovesRestricted') == 2)){
					BW.prepend($('<DIV class="notice header">Not all moves can be used in all battles. In this battle your Pokemon can only use moves that share a type with your Pokemon and moves that do not perform a one-hit KO. All other moves have been removed from your moves list.</DIV>'));
				} else if (Battle.attr('MovesRestricted') && (Battle.attr('MovesRestricted') == 3)){
					BW.prepend($('<DIV class="notice header">Not all moves can be used in all battles. In this battle your Pokemon cannot use any move that confuse yourself or your opponent and no moves that only change a Pokemon\'s status or stats.</DIV>'));
				}
				if (Battle.attr('MaxLevel')){
					BW.prepend($('<DIV class="notice header">This gym has a level limit. If your Pokemon is above level ' + Battle.attr('MaxLevel') + ' it will be unable to participate in this battle.</DIV>'));
				}

				var BattleTitle = Battle.find('BattleTitle');
				BattleTitle = (BattleTitle.length == 1) ? BattleTitle.eq(0).text() : 'Pokemon Battle';
				BW.prepend($('<H2 id="battleTitle">' + BattleTitle + '</H2>'));
				
				
			}
			BW.prepend($('<INPUT type="hidden" id="BattleID" value="' + BattleID + '" />'));
		
			
			var Trainer1 = xml.children('Trainer1');
			if (Trainer1.length == 1){
				Trainer1 = Trainer1.eq(0);
				
				var T1_id = Trainer1.attr('id').substring(1);
				var T1_Active = Trainer1.attr('Active').substring(3);
				var T1_List = Trainer1.find('Pokemon');
				var T1_Name = Trainer1.children('name');
				if (T1_Name.length == 1)
					T1_Name = T1_Name.eq(0).text();
				else T1_Name = 'Trainer';
				
				var Starter1 = null;
				if (T1_List.eq(T1_Active).attr('id') == 'T1_' + T1_Active){
					Starter1 = T1_List.eq(T1_Active);
				} else {
					for (var i = 0; i < T1_List.length; i++){
						if (T1_List.eq(i).attr('id') == 'T1_' + T1_Active){
							Starter1 = T1_List.eq(i);
						}
					}
				}
				
			}
			
			renderStarter($('#Trainer1_Active'), Starter1, T1_Name);
			
			renderPokemonListing($('#Trainer1_Pokemon'), T1_List, Starter1, (T1_id == TrainerID));
			
			var Trainer2 = xml.children('Trainer2');
			if (Trainer2.length == 1){
				Trainer2 = Trainer2.eq(0);
				
				var T2_id = Trainer2.attr('id').substring(1);
				var T2_Active = Trainer2.attr('Active').substring(3);
				var T2_List = Trainer2.find('Pokemon');
				var T2_Name = Trainer2.children('name');
				if (T2_Name.length == 1)
					T2_Name = T2_Name.eq(0).text();
				else T2_Name = 'Trainer';
				
				var Starter2 = null;
				if (T2_List.eq(T2_Active).attr('id') == 'T2_' + T2_Active){
					Starter2 = T2_List.eq(T2_Active);
				} else {
					for (var i = 0; i < T2_List.length; i++){
						if (T2_List.eq(i).attr('id') == 'T2_' + T2_Active){
							Starter2 = T2_List.eq(i);
						}
					}
				}
				
			}
			
			renderStarter($('#Trainer2_Active'), Starter2, T2_Name);
			
			renderPokemonListing($('#Trainer2_Pokemon'), T2_List, Starter2, (T2_id == TrainerID));			
			
	
		
			var checkWinner = xml.find('Winner');
			var checkWait = xml.find('Wait');
			// Winner tag only exists if there's a winner
			if (checkWait.length != 0){
				// we're waiting here for the opponent; can only get here if this is a real battle
				if ($('MoveBox')){

					statusNote($('MoveBox'), 'Waiting for opponent...', (checkWait[0].firstChild) ? checkWait[0].firstChild.data : null);
					var refresh = setTimeout("getBattleStatus()", 20000);
					
				}				
			} else if (checkWinner.length != 1){
				$('#cancelBattle').append($('<A href="#">Leave Battle</A>'));
				$('#cancelBattle').children('A').click(function(e){
					getBattleStatus({ MyMove: 'iQuit', pageID: e.pageX + "." + e.pageY });		
				});
				
				if (TrainerID == T1_id){
					var Moves = Trainer1.find('Move');
					if (Starter2.attr('CurrentHP') > 0)
						renderMoves(Moves, Starter1, 1, 0);
					else renderWait(1, BattleType);
				} else if (TrainerID == T2_id){
					var Moves = Trainer2.find('Move');
					if (Starter1.attr('CurrentHP') > 0)
						renderMoves(Moves, Starter2, 2, 0);
					else renderWait(2, BattleType);
				}
			} else if ((checkWinner.length == 1) && ((Battle.attr('Type') == 'Trainer') || (Battle.attr('Type') == 'TrainingChallenge'))){
				$('#cancelBattle').append($('<A href="#">Restart Battle</A>'));
				$('#cancelBattle').children('A').click(function(){
					var restart = document.location.href;
					restart = restart.replace(/battle\.php.*$/, '');
					restart += 'battle.php?Battle=' + Battle.attr('Type') + '&Trainer=' + T2_id;
					
					document.location = restart;		
				});
				
			}
			var Texts = xml.find('text');
			renderText($('#battleText'), Texts, T1_id, T2_id);

			
			
			// if they want to quit
			
			
			
		}