
$(document).ready(function(){$(".revija-stevilcenje").click(function(e){e.preventDefault();$(this).parent().find(".revija-seznam-clankov-container").slideToggle();});$(".datoteka-ni-javna").click(function(e){var oldValue=$(this).attr("href");var idx=oldValue.indexOf("&hash=");if(idx===-1){var geslo=window.prompt("Vpišite geslo za ogled dela.","");if(geslo==null||geslo.length<1){e.preventDefault();return false;}
$(this).attr("href",oldValue+"&hash="+geslo);}else{}});});String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");}
String.prototype.ltrim=function(){return this.replace(/^\s+/,"");}
String.prototype.rtrim=function(){return this.replace(/\s+$/,"");}
String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.substr(1).toLowerCase();}
function Submit_GradivoUvoz_Uvoz(index,mode){document.form.hidAkcija.value=mode;document.form.hidRezIndex.value=index;document.form.submit();}
function Submit_Generic(op,text){if(text!=null){if(!confirm(text)){return false;}}
document.form.hidAkcija.value=op;document.form.submit();}
function doLockSubmit(el,op){if(el!=null){el.disabled=true;}
document.form.hidAkcija.value=op;document.form.submit();}
function Submit_Iskanje(vrsticNaprednegaIskanja){vir=document.form.vir.value.toLowerCase();tip=document.form.type.value.toLowerCase();query='';if(vir!='dk'){if(vir=='cobiss'){alert(prevedi('izberiteCobissVir'));return;}
else if(vir.charAt(0)=='c'){vir=vir.substr(1);if(tip=='enostavno'){query='?q='+document.form.niz.value;}
else if(tip=='napredno'){query=CreateCOBISSSearchString(vrsticNaprednegaIskanja);if(query.length>0){query='/advanced?'+query;}}
if(query.length>0){let lang=prevedi('lang_id_iso1');query=('https://plus.cobiss.net/cobiss/si/'+lang+'/bib/search'+
query+'&db='+vir+'&mat=allmaterials');}}
else{document.form.submit();return;}
if(query.length>0)
window.open(query);else
alert(prevedi('vpisiteIskalniNiz'));}
else{document.form.submit();}}
function Iskanje_onKeyDown(e){code=0;if(window.event){code=e.keyCode;if(code==13)e.keyCode=0;}
else if(e.which){code=e.which;}
if(code==13){if(e.preventDefault)e.preventDefault();if(document.form.page)document.form.page.value=1;document.form.submit();}}
function HitroIskanje_onKeyDown(e){code=0;if(e!=null){if(window.event){code=e.keyCode;if(code==13)e.keyCode=0;}
else if(e.which){code=e.which;}}
else
code=13;if(code==13){if(e!=null&&e.preventDefault)e.preventDefault();var niz=e.target.value;var vir=$("#iskaniVir").find(":selected").val();HitroIskanje_Sprozi(niz,vir);}}
function HitroIskanje_OnLupaClick(e){var niz=$("input#hitriIskalnik").val();var vir=$("#iskaniVir").find(":selected").val();if(niz===prevedi('hitroIskanje')){niz='';$("input#hitriIskalnik").val(niz);}
HitroIskanje_Sprozi(niz,vir);}
function HitroIskanje_Sprozi(niz,vir){if(vir=='cobiss'){alert(prevedi('izberiteCobissVir'));return;}
else if(vir.charAt(0)=='c'){vir=vir.substr(1);if(niz.length>0){let lang=prevedi('lang_id_iso1');window.open('https://plus.cobiss.net/cobiss/si/'+lang+'/bib/search?q='+niz+'&db='+vir+'&mat=allmaterials');}
else{alert(prevedi('vpisiteIskalniNiz'));}}
else{let path='';if(window.location.href.indexOf('/zaposleni/')>0||window.location.href.indexOf('/student/')>0){path='../';}
location.href=(path+"Iskanje.php?type=enostavno&niz="+niz+"&vir="+vir+"&lang="+cfgLangID);}}
function HitroIskanje_onFocus(e){if(e.target.value==prevedi('hitroIskanje')){e.target.value='';}}
function HitroIskanje_onBlur(e){if(e.target.value==''){e.target.value=prevedi('hitroIskanje');}}
function PonastaviIskanje(st){for(var i=0;i<st;i++){if(i>0){$('#op'+i).val(0);}
$("input[name='niz"+i+"']").val('');$('#stl'+i).val(0);}
$('#vrsta').val(0);$('#jezik').val(0);$('#vir').val(0);}
function CreateCOBISSSearchString(stVrstic){niz='';vrednost='';for(let i=0;i<stVrstic;i++){ctrl=document.getElementsByName('niz'+i);if(ctrl.length==1){vrednost=ctrl[0].value.replace(' ','+');if(vrednost.length>0){op='&';if(i>0){ctrl=document.getElementsByName('op'+i);if(ctrl.length==1&&niz.length>0){ctrl=ctrl[0].value.toLowerCase();if(ctrl=='or'){op+='or-';}
else if(ctrl=='and not'){op+='not-';}}}
ctrl=document.getElementsByName('stl'+i);if(ctrl.length==1){switch(ctrl[0].value.toUpperCase()){case'NASLOV':niz+=op+'ti='+encode(vrednost);break;case'AVTOR':niz+=op+'ax='+vrednost;break;case'KLJUCNEBESEDE':niz+=op+'kw='+vrednost;break;case'LETOIZIDA':niz+='&pdfrom=01.01.'+vrednost+'&pdto=21.12.'+vrednost;break;}}}}}
return niz;}
function encode(niz){novNiz="";for(let i=0;i<niz.length;i++){switch(niz.charAt(i)){case'č':novNiz+="%E8";break;case'Č':novNiz+="%C8";break;case'ć':novNiz+="%E6";break;case'Ć':novNiz+="%C6";break;case'đ':novNiz+="%F0";break;case'Đ':novNiz+="%D0";break;case'š':novNiz+="%9A";break;case'Š':novNiz+="%8A";break;case'ž':novNiz+="%9E";break;case'Ž':novNiz+="%8E";break;default:novNiz+=niz.charAt(i);break;}}
return novNiz;}
function showHelp(id,urlpart){if(urlpart==null)urlpart="";winWidth=700;winLeft=screen.width-winWidth-50;var w=window.open(urlpart+"pomoc.php?id="+id,"helpWindow","width="+winWidth+",height=800,top=150,left="+winLeft+",scrollbars=1");w.focus();}
function setFontSize(size){document.body.style.fontSize=size;}
function DataGrid_onKeyDown(e,url){code=0;if(window.event){code=e.keyCode;if(code==13)e.keyCode=0;}
else if(e.which){code=e.which;}
if(code==13){if(e.preventDefault)e.preventDefault();ime="";vrednost="";if(e.srcElement){ime=e.srcElement.name;vrednost=e.srcElement.value;}
else if(e.target){ime=e.target.name;vrednost=e.target.value;}
if(url)
location.href=url+ime+"="+vrednost;else
document.form.submit();}}
function danesPlusLeta(elName,let){event.preventDefault();if(let==null)let=1;d=new Date();dan=d.getDate();mesec=d.getMonth()+1;leto=d.getFullYear()+let;$("input[name='"+elName+"']").val(dan+"."+mesec+"."+leto);}
function createUserData(){line=prompt(prevedi('vpisiteVrsticoSpodatki'),"").trim();if(line==""){alert(prevedi('vnesenPrazniNiz'));return;}
line=line.toLowerCase();line=line.replace("\t"," ");line=line.replace(/\s+/," ");line=line.replace(/[\(\)\{\}\[\]]/g,"");line=line.split(" ");if(line.length>4){alert(prevedi('nepricakovanoVelikoPodatkov'));return;}
staroIme=document.form.txtIme.value;document.form.txtIme.value="";for(i=0;i<line.length;i++){if(line[i].indexOf("@")>0)
document.form.txtEPosta.value=line[i];else if(line[i].indexOf("/")>0){si=line[i].indexOf("/");document.form.txtUIme.value=line[i].substr(0,si);document.form.txtGeslo.value=line[i].substr(si+1);}
else if(document.form.txtIme.value=="")
document.form.txtIme.value=line[i].capitalize();else
document.form.txtPriimek.value=line[i].capitalize();}
if(document.form.txtIme.value=="")
document.form.txtIme.value=staroIme;}
function zamenjajVrednostiPolj(polje1,polje2){tmp=polje1.value;polje1.value=polje2.value;polje2.value=tmp;}
function logAkcijPonastavi(){document.form.txtObjektID.value='';document.form.ddlTipObjekta.selectedIndex=0;document.form.ddlAkcija.selectedIndex=0;document.form.ddlStatus.selectedIndex=0;document.form.txtUIme.value='';document.form.txtOd.value='';document.form.txtDo.value='';}
function izvoziZServer(){$("#dtHide").attr("class","UnHide");$("#ddHide").attr("class","UnHide");$("#ClipBoardAction").text("Zapri");document.form.txtClipBoard.value=(document.form.txtNaziv.value+"\n"+
document.form.txtURI.value+"\n"+
document.form.txtUIme.value+"\n"+
document.form.txtUGeslo.value+"\n"+
document.form.txtXSL.value+"\n"+
document.form.txtTimeOut.value+"\n"+
document.form.txtOutputSyntax.value+"\n");}
function uvoziZServer(){$("#dtHide").attr("class","UnHide");$("#ddHide").attr("class","UnHide");$("#ClipBoardAction").html("Uvozi");document.form.txtClipBoard.value="";}
function zapriZServer(){if($("#ClipBoardAction").html()=="Uvozi"){vrstice=$("[name=txtClipBoard]").val().split("\n");if(vrstice.length>=1)$("[name=txtNaziv]").val(vrstice[0]);if(vrstice.length>=2)$("[name=txtURI]").val(vrstice[1]);if(vrstice.length>=3)$("[name=txtUIme]").val(vrstice[2]);if(vrstice.length>=4)$("[name=txtUGeslo]").val(vrstice[3]);if(vrstice.length>=5)$("[name=txtXSL]").val(vrstice[4]);if(vrstice.length>=6)$("[name=txtTimeOut]").val(vrstice[5]);if(vrstice.length>=7)$("[name=txtOutputSyntax]").val(vrstice[6]);}
$("#dtHide").attr("class","Hide");$("#ddHide").attr("class","Hide");document.form.txtClipBoard.value="";}
function prijaviKomentar(pKomentarID){$.post('ajax.php',{cmd:'prijaviKomentar',KomentarID:pKomentarID},function(xml){var rezultat=[$("message",xml).text()];$('#komentar_'+pKomentarID).html(rezultat.join(''));});}
function toggleDodajKomentar(){if($("#DodajKomentar").css("display")=="block"){$("#DodajKomentar").css("display","none");$("#DodajKomentarBar").css("background-image","url('"+cfgTema+"img/BarArrowDesno.gif')");}
else{$("#DodajKomentar").css("display","block");$("#DodajKomentarBar").css("background-image","url('"+cfgTema+"img/BarArrowDol.gif')");}}
function toggleKomentarji(){if($("#Komentarji").css("display")=="block"){$("#Komentarji").css("display","none");$("#KomentarjiBar").css("background-image","url('"+cfgTema+"img/BarArrowDesno.gif')");}
else{$("#Komentarji").css("display","block");$("#KomentarjiBar").css("background-image","url('"+cfgTema+"img/BarArrowDol.gif')");}}
function prikazSlike(objID){xOffset=10;yOffset=30;$(objID).hover(function(e){this.t=this.title;this.title='';$("body").append("<p id='TooltipPicture'><img src='../"+cfgTema+"img/logo/"+this.t+"' alt='"+this.t+"' /></p>");$("#TooltipPicture").css("top",(e.pageY-xOffset)+"px").css("left",(e.pageX+yOffset)+"px").fadeIn("fast");},function(){this.title=this.t;$("#TooltipPicture").remove();});$(objID).mousemove(function(e){$("#TooltipPicture").css("top",(e.pageY-xOffset)+"px").css("left",(e.pageX+yOffset)+"px");});}
function izpisiUporabnika(uid,e){$('#UserData').html('Loading...');$('#UserData').attr('cX',e.clientX+30);$('#UserData').attr('cY',e.clientY);$.post('../ajax.php',{cmd:'getUserData',uid:uid},function(rez){var el=$('#UserData');el.css('top',el.attr('cY')+'px');el.css('left',el.attr('cX')+'px');el.css('display','block');el.html(rez+'<br /><a href="#" onclick="$(\'#UserData\').css(\'display\',\'none\')">Zapri</a>');el.removeAttr('cX');el.removeAttr('cY');});}
function isEnterKey(e){code=0;if(e!=null){if(window.event){code=e.keyCode;if(code==13)e.keyCode=0;}
else if(e.which){code=e.which;}}
else
code=13;if(code==13){if(e!=null&&e.preventDefault)
e.preventDefault();}
return code==13;}
function dodajVZbirko(gradivoID){zbirkaID=0;zbirkaID=$("#ddlZbirkaID").val();$.post('ajax.php',{cmd:'addToCorpus',gradivoID:gradivoID,zbirkaID:zbirkaID},function(rez){$('#statusDGZ_'+gradivoID).show().html(rez).fadeOut(3000);});}
function naloziBesedilo(id){location.href='?id='+id+'&tip='+$('#tip').val();}
function odstraniPrazneVrstice(id){var sv=$('#'+id).val().split("\n");var nv=new Array();for(var i=0;i<sv.length;i++){sv[i]=sv[i].trim();if(sv[i].length>0)
nv.push(sv[i]);}
$('#'+id).val(nv.join("\n"));}
function pocistiMailFormo(){document.form.to.value='';document.form.subject.value='';document.form.body.value='';}
function preklopiPrikazDbStatus(){if($('#tip').is(':checked'))
location.href='DbStatus.php?cmd=perf&tip=pomembni';else
location.href='DbStatus.php?cmd=perf&tip=';}
var seznamOpisov=[];var opisi_timeoutID=0;var cakam_gID=0;function vrniLokalniOpis(gID){for(var i=0;i<seznamOpisov.length;i++){if(seznamOpisov[i].gID==gID)
return seznamOpisov[i].opis;}
return'';}
function prikaziOpis(gID){if(opisi_timeoutID!=0){clearTimeout(opisi_timeoutID);}
opisi_timeoutID=setTimeout(function(){resPrikaziOpis(gID);},800);}
function resPrikaziOpis(gID){opisi_timeoutID=0;var opis=vrniLokalniOpis(gID);if(opis!=''){osveziOpis(opis);return;}
if(cakam_gID>0){return;}
cakam_gID=gID;osveziOpis('<b>Opis:</b>'+getLoaderImg());$.get('ajax.php?cmd=getOpis&gID='+gID,function(data){if(data=='')
data=prevedi('opisNiNaVoljo');data='<b>'+prevedi('opis')+'</b>'+data;seznamOpisov.push({gID:gID,opis:data});osveziOpis(data);cakam_gID=0;});}
function osveziOpis(data){var el=$('#OpisToolTip');$(el).html(data);$(el).css('display','block');pos=parseInt(($(el).parent().css('width')))-10;$(el).css('width',pos+'px');pos=parseInt($(el).css('height'))+10;$(el).css('top','-'+pos+'px');}
function skrijOpis(){if(opisi_timeoutID!=0){clearTimeout(opisi_timeoutID);}
opisi_timeoutID=0;$('#OpisToolTip').html('');$('#OpisToolTip').css('display','none');}
function getLoaderImg(){return('<img src="'+cfgTema+'img/ajaxLoader.gif"'+' alt="'+prevedi('pocakajte')+'" title="'+prevedi('pocakajte')+'" />');}
function prevedi(kljuc){return(lang[kljuc]!=null)?lang[kljuc]:kljuc;}
function izberiKategorijo(langID,kat1,kat2,kat3){var link=getCurrentPage()+'?kat1='+kat1;if(kat2!=null)link+='&kat2='+kat2;if(kat3!=null)link+='&kat3='+kat3;if(langID!=null&&langID!='slv'){link+='&lang='+langID;}
location.href=link;}
function getCurrentPage(){var url=window.location.pathname;url=url.substring(url.lastIndexOf('/')+1);return url;}
function prikaziIzbranega(eID){var el=document.getElementById(eID);if(el==null)return;if(el.childNodes.length<2)return;var ulHeight=el.clientHeight;var liHeight=0;var selected=0;var numberOfLi=0;for(var i=0;i<el.childNodes.length;i++){if(el.childNodes[i].tagName==undefined)continue;if(el.childNodes[i].tagName.toLowerCase()!='li')continue;numberOfLi++;if(el.childNodes[i].className=="Sel"){liHeight=el.childNodes[i].clientHeight;selected=numberOfLi;break;}}
if(selected==0)return;var bestScrollX=selected*liHeight;if(bestScrollX<ulHeight){return;}
if(bestScrollX>el.scrollHeight-ulHeight){el.scrollTop=el.scrollHeight;}
else{el.scrollTop=bestScrollX-Math.round(ulHeight/2);}}
function izbiraEmbargaAdmin(){var id=$('select#selIzbiraEmbargaAdmin option:selected').attr("id");if(id==2){$('#txtEmbargoDo').removeAttr('disabled');$('#setEmbargoLeta').show();}else{$('#txtEmbargoDo').val('');$('#txtEmbargoDo').attr('disabled','disabled');$('#setEmbargoLeta').hide();}}
function izbiraFinancerja(el,mode){var ctx=$(el).parent();if(mode=='zaposleni')
ctx=$(el).parent().parent();var izbran=$(el).val();var div='div.programFinanciranjaContainer ';if(izbran==='0'){$('.opozoriloNiFinancerja',ctx).css('display','inline');$(div+'select',ctx).css('display','none');$(div+'select',ctx).prop('disabled',true);}
else{$('.opozoriloNiFinancerja',ctx).css('display','none');$(div+'select',ctx).css('display','none');$(div+'select',ctx).prop('disabled',true);$(div+'select.selProgramFinanciranja'+izbran,ctx).css('display','inline');$(div+'select.selProgramFinanciranja'+izbran,ctx).prop('disabled',false);}}
function izbiraNadgradiva(){skrivajPoljaNadgradiva();$("select#izbiraNadgradiva").change(function(){skrivajPoljaNadgradiva();});}
function skrivajPoljaNadgradiva(){$("select#izbiraNadgradiva option:selected").each(function(){if($(this).val()==="0"){$("#adminNadgradivaBrez").css('display','block');$("#adminNadgradivaRevija").css('display','none');$("#adminNadgradivaMonografija").css('display','none');}
else if($(this).val()==="1"){$("#adminNadgradivaBrez").css('display','none');$("#adminNadgradivaRevija").css('display','block');$("#adminNadgradivaMonografija").css('display','none');}
else if($(this).val()==="2"){$("#adminNadgradivaBrez").css('display','none');$("#adminNadgradivaRevija").css('display','none');$("#adminNadgradivaMonografija").css('display','block');}});}
function odstraniUrednikaAdmin(event,obj){var tr=$(obj).closest('tr');tr.remove();$("table#tabelaUrednikovAdmin tr[class=urednikiDataRow]").each(function(index){this.childNodes[0].childNodes[0].name="urednikPriimek"+index;this.childNodes[1].childNodes[0].name="urednikIme"+index;this.childNodes[2].childNodes[0].name="urednikCONORID"+index;});event.preventDefault();}
function dodajUrednikaAdmin(event){var indexNovega=$('#tabelaUrednikovAdmin tr').length-2;var priimek="<input type=\"hidden\" name=\"urednikPriimek"+indexNovega+"\" value=\""+$("#novUrednikPriimek").val()+"\" >";priimek+=$("#novUrednikPriimek").val();var ime="<input type=\"hidden\" name=\"urednikIme"+indexNovega+"\" value=\""+$("#novUrednikIme").val()+"\" >";ime+=$("#novUrednikIme").val();var cobissid="<input type=\"hidden\" name=\"urednikCONORID"+indexNovega+"\" value=\""+$("#novUrednikCONORID").val()+"\" >";cobissid+=$("#novUrednikCONORID").val();var odstranjevanje="<a href=\"\" onclick=\"odstraniUrednikaAdmin(event, this);\">Odstrani</a>";var vrstica="<tr><td>"+priimek+"</td><td>"+ime+"</td><td>"+cobissid+"</td>"+"<td>"+odstranjevanje+"</td></tr>";$('table#tabelaUrednikovAdmin tr:last').before(vrstica);event.preventDefault();}
function OnEnterDoNothing(event){if(event.keyCode===10||event.keyCode===13){event.preventDefault();}}
function onChange_ddlDomena(){var sel=$('#ddlDomena').val();if(sel==4){$('#prijava_obrazec').hide();$('#prijava_aai').show();}
else{$('#prijava_aai').hide();$('#prijava_obrazec').show();}}
function onChange_ddlNamen(){var dID=$("input[name='hidDatotekaID']").val();if(dID==0){var namen=$("select[name='ddlNamen']").val();namen=(namen==1)?false:true;$('#chkJeJavnoVidna').prop('checked',namen);}}
function resizeContent(){var visOkna=$(window).height();var visina=$('.platno').height();var footer=$('footer').css('position');if(footer=='fixed')visina+=170;if(visina>visOkna){$('footer').css('position','static');$('#footerMargin').css('margin-bottom','0px');}
else{$('footer').css('position','fixed');}}
function inic_citation(gID,cslJson){var sys={retrieveLocale:function(lang){return citeprocdata.locales[lang];},retrieveItem:function(id){return cslJson;},getAbbreviations:function(name){return{"default":{}};}};var naslovIzCslJson=cslJson["title"];var urlIzCslJson=cslJson["URL"];function izpisCitata(stil,gID){var cslStyle=citeprocdata.styles[stil];var lang=(cfgLangID=='slv'?'sl-SI':'en-US');if(stil==="ieee"){let url=new URL(cslJson["URL"]);let params=new URLSearchParams(url.search);params.delete('lang');url=url.origin+url.pathname+"?"+params.toString();cslJson["URL"]=url;}
else{cslJson["URL"]=urlIzCslJson;}
if(stil==="harvard"&&cslJson["type"]==="thesis"){let naslovDelaJson=cslJson["title"];let indeksZadnjeDvopicje=naslovDelaJson.lastIndexOf(" : ");cslJson["title"]=naslovDelaJson.slice(0,indeksZadnjeDvopicje);}
else{cslJson["title"]=naslovIzCslJson;}
var citeproc=new CSL.Engine(sys,cslStyle,lang,lang);citeproc.setOutputFormat("html");citeproc.updateItems([gID.toString()]);var outputObj=citeproc.makeBibliography();if(outputObj&&outputObj.length>1&&outputObj[1].length>0){var output=jQuery.trim(outputObj[0].bibstart+outputObj[1].join("")+outputObj[0].bibend);jQuery("#citat").html(output);}}
var defaultStyle="iso690";var url='ajax.php?cmd=getCsl&gID='+gID+'&lang='+cfgLangID;izpisCitata(defaultStyle,gID);jQuery("#citatSeznam").change(function(){switch(this.value){case"ris":case"refer":case"endnotexml":case"txt":window.open(url+"&format="+this.value,"_blank");jQuery(this).val(defaultStyle);izpisCitata(defaultStyle,gID);break;default:izpisCitata(this.value,gID);break;}});jQuery('#btnDumpAllCitations').click(function(){let styles=['bibtex','abnt','acm','ama','apa','chicago','harvard','ieee','iso690','mla','vancouver'];let rez=styles.map((el)=>{izpisCitata(el,gID);return $('#citat').text();});jQuery("#citat").text(rez.join("\n"));});}
function vpisiDanasnjiDatumZaDnevnikAkcij(){var d=new Date();var mes=(d.getMonth()<9)?'0'+(d.getMonth()+1):d.getMonth()+1;var dan=(d.getDate()<10)?'0'+d.getDate():d.getDate();dan=d.getFullYear()+'-'+mes+'-'+dan;document.form.txtOd.value=dan;document.form.txtDo.value=dan;}
function getCookie(cName){var c_value=document.cookie;var c_start=c_value.indexOf(" "+cName+"=");if(c_start==-1)
c_start=c_value.indexOf(cName+"=");if(c_start==-1){c_value=null;}
else{c_start=c_value.indexOf("=",c_start)+1;var c_end=c_value.indexOf(";",c_start);if(c_end==-1){c_end=c_value.length;}
c_value=unescape(c_value.substring(c_start,c_end));}
return c_value;}
function udata_accordionactivate(e,ui){if(ui.newHeader.attr('id')==null)return;if(ui.newHeader.attr('data-isLoaded')==null){ui.newHeader.attr('data-isLoaded','1');ui.newPanel.html(getLoaderImg());var data={'cmd':'vrniZapiseUporabnika','tabela':ui.newHeader.attr('id')};jQuery.post('ajax.php',data).done(function(data){ui.newPanel.html(data);});}}
function poljaDoNothingOnEnter(event){if(event.keyCode===10||event.keyCode===13){event.preventDefault();}}
function setCursorAtEnd(el){var v=el.value;el.value='';el.value=v;}
function parseCurrency(val){val=val.trim();if(val=='')return val;var pPika=val.lastIndexOf('.');var pVeja=val.lastIndexOf(',');if(pPika>0&&pVeja>0){val=(pPika<pVeja)?val.replace(/\./g,''):val.replace(/,/g,'');}
if(pVeja>0){val=val.replace(/,/g,'.');}
return parseFloat(val);}
function fixKeywordCaseById(elID){var el=$('#'+elID);if(el){el.val(fixKeywordCase(el.val()));}}
function fixKeywordCase(val){var vals=val.split(' ');for(var i=0;i<vals.length;i++){var txt=vals[i];var doConvert=true;for(var j=1;j<txt.length;j++){var c=txt.charAt(j);if(c==','||c==';')continue;if(c===c.toUpperCase()){doConvert=false;break;}}
if(doConvert){vals[i]=txt.charAt(0).toLowerCase()+txt.slice(1);}}
return vals.join(' ');}
function isValidSloDate(val){var date_regex=/^(0?[1-9]|1\d|2\d|3[01])\.(0?[1-9]|1[0-2])\.(1|2)\d{3}$/;return date_regex.test(val);}
function showPageOfFiles(e,gID,page){var pageSessionKey='g'+gID+'-filesPage';var storage=null;try{if(sessionStorage){storage=sessionStorage;}}
catch(exception){storage=null;}
if(e!=null){e.preventDefault();}
if(page==null){if(storage){page=storage.getItem(pageSessionKey);}
page=(page==null)?1:page;}
var imgUrl=cfgTema+'img/';var url='ajax.php?cmd=getFiles&gID='+gID+'&lang='+cfgLangID;url+='&page='+page+'&pagesize=5';$('#listOfFiles').append('<div class="zavesa"><img src="'+imgUrl+'ajaxLoader.gif" alt="'+
prevedi('podatkiSeNalagajo')+'" /></div>');$.get(url).done(function(data){data=JSON.parse(data);var sb=[];sb.push('<table class="ZadetkiIskanja"><tbody>');for(var i=0;i<data.files.length;i++){var row=data.files[i];sb.push('<tr><td class="zaIzpisDatotek">');sb.push('<table class="izpisDatotek noBottomMargin"><tr><td>');sb.push('<a href="Dokument.php?id=',row.ID,'&lang=',cfgLangID,'">');sb.push('<img src="',row.IkonaFormataPolniUrl,'" alt="',row.FormatDatoteke,'" /> ');sb.push('</a></td><td><span class="izpisDatotek-ime">');if(row.URL!=''){sb.push('<a href="Dokument.php?id=',row.ID,'">',row.URL,'</a></span>');sb.push('<br />',row.Namen);}
else{if(row.VidnoOd==''){sb.push('<a href="Dokument.php?id=',row.ID,'&lang=',cfgLangID,'">',row.Naziv,'</a></span>');}
else{sb.push(row.Naziv,'</span><br /><b>',prevedi('izpis_vidnoOd'),mySqlToSloDate(row.VidnoOd),'</b>');}
if(row.ImaOmejenDostop){sb.push('<br /><b>',prevedi('izpis_imaOmejenDostop'),'</b>');}
else if(row.ImaTrajniEmbargo){sb.push('<br /><b>',prevedi('izpis_imaTrajniEmbargo'),'</b>');}
sb.push('<br />',row.Namen);if(row.VelikostDatoteke>0){sb.push(' - ',row.VelikostDatotekeKratko);}
if(row.Verzija!=''){sb.push(' - ',prevedi('izpis_verzija'),': '+row.Verzija);}
if(row.MD5!=''){sb.push('<br />MD5: ',row.MD5);}
if(row.PID!=''){let tmp=row.PID;if(row.PID_URL!=''){tmp='<a href="'+row.PID_URL+'" target="_blank">'+row.PID;tmp+='</a>';}
sb.push('<br />PID: ',tmp);}}
if(row.Opis!=''){sb.push('<br />',makeLinks(row.Opis));}
sb.push('</td></tr></table>');sb.push('</td></tr>');}
if(data.files.length<=0){sb.push('<tr><td>',prevedi('izpis_seznamJePrazen'),'</td></tr>');}
sb.push('<tbody>');var pinfo=data.pagingInfo;var pagerButtons=10;var startPage=pinfo.currentPage-(pagerButtons/2);var endPage=startPage+pagerButtons;var startRecord=((pinfo.currentPage-1)*pinfo.pageSize)+1;var endRecord=pinfo.currentPage*pinfo.pageSize;endRecord=(endRecord>pinfo.numberOfRecords)?pinfo.numberOfRecords:endRecord;if(startPage<1){startPage=1;endPage=pagerButtons-1;if(pagerButtons%2==0)endPage++;}
if(endPage>pinfo.numberOfPages){endPage=pinfo.numberOfPages;startPage=endPage-pagerButtons+1;}
startPage=(startPage<1)?1:startPage;page=(page>pinfo.numberOfPages)?pinfo.numberOfPages:page;page=(page<1)?1:page;if(storage){storage.setItem(pageSessionKey,page);}
var prevPage=pinfo.currentPage-1;var nextPage=pinfo.currentPage+1;prevPage=(prevPage<1)?1:prevPage;nextPage=(nextPage>pinfo.numberOfPages)?pinfo.numberOfPages:nextPage;if(data.files.length>0){sb.push('<tfoot><tr class="Numeric"><td colspan="1">');sb.push('<div class="Stat">',startRecord,' - ',endRecord,' / ',pinfo.numberOfRecords,'</div>');sb.push('<a href="" onclick="showPageOfFiles(event, ',gID,', 1)">','<img src="',imgUrl,'dg.prvi.gif" alt="',prevedi('izpis_naPrvo'),'" title="',prevedi('izpis_naPrvo'),'" /></a>','<a href="" onclick="showPageOfFiles(event, ',gID,', ',prevPage,')">','<img src="',imgUrl,'dg.nazaj.gif" alt="',prevedi('izpis_naPrejsnjo'),'" title="',prevedi('izpis_naPrejsnjo'),'" /></a>');for(var i=startPage;i<=endPage;i++){sb.push('<a href="" onclick="showPageOfFiles(event, ',gID,', ',i,')" ',(page==i?'class="sel"':'class="pBtn"'),'>',i,'</a>');}
sb.push('<a href="" onclick="showPageOfFiles(event, ',gID,', ',nextPage,')">','<img src="',imgUrl,'dg.naprej.gif" alt="',prevedi('izpis_naNaslednjo'),'" title="',prevedi('izpis_naNaslednjo'),'" /></a>','<a href="" onclick="showPageOfFiles(event, ',gID,', ',pinfo.numberOfPages,')">','<img src="',imgUrl,'dg.zadnji.gif" alt="',prevedi('izpis_naZadnjo'),'" title="',prevedi('izpis_naZadnjo'),'" /></a>','</td></tr></tfoot>');}
sb.push('</table>');if(!storage){sb.push(prevedi('izpis_files_noCookies'));}
$('#listOfFiles').html(sb.join(''));});}
function mySqlToSloDate(date){date=date.split('-');date=date[2]+'.'+date[1]+'.'+date[0];return date;}
function showEl(sel,e){if(e!=null){e.preventDefault();}
$(sel).show();}
function doPost(url,params){let form=document.createElement('form');form.method='post';form.action=url;for(let key in params){let hidField=document.createElement('input');hidField.type='hidden';hidField.name=key;hidField.value=params[key];form.appendChild(hidField);}
document.body.appendChild(form);form.submit();}
function setCmd(cmd){document.form.hidAkcija.value=cmd;}
function copyText(elID){let el=document.getElementById(elID);navigator.clipboard.writeText(el.innerHTML);}
function hideBackButtonWithNoHistory(){if(history.length===1){$('.povezavaNazaj').hide();}}
function copyTextDiv(elID){var range=document.createRange();range.selectNode(document.getElementById(elID));window.getSelection().removeAllRanges();window.getSelection().addRange(range);document.execCommand("copy");window.getSelection().removeAllRanges();}
function makeLinks(text){return text.replaceAll(/(http|https|ftp|file)[^\s,]+[^.\s|^,\s|^)\s]/ig,'<a href="$&" target="_blank">$&</a>');}
function danesVidnoOd(elName){event.preventDefault();d=new Date();dan=d.getDate();mesec=d.getMonth()+1;leto=d.getFullYear();$("input[name='"+elName+"']").val(dan+"."+mesec+"."+leto+" 00:00:00");}
function danesVidnoDo(elName){event.preventDefault();d=new Date();dan=d.getDate();mesec=d.getMonth()+1;leto=d.getFullYear();$("input[name='"+elName+"']").val(dan+"."+mesec+"."+leto+" 23:59:59");}