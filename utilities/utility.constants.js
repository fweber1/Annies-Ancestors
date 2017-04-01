// updated 1/12/17, still in testing

(function () {
'use strict';

angular
.module('root')
	
	.constant('KqualRef', '<md-toast>0 = Unreliable evidence or estimated data<br>' +
		'1= Questionable reliability of evidence' +
		' (interviews, census, oral genealogies, or potential for bias for example, an autobiography<br>' +
		'2 = Secondary evidence, data officially recorded sometime after event<br>' +
		'3 = Direct and primary evidence used, or by dominance of the evidence</md-toast>'
	)
 
 	.constant("KnoteTypes", {
		name	:1,
		birth	:2
	})
 		
 	.constant("KfamilyEvStruct", [
		{value:"ANUL"	, label:'Annulment'}, 				
		{value:"CENS"	, label:'Census'}, 				
		{value:"DIV"	, label:'Divorce'}, 				
		{value:"DIVF"	, label:'Divorce Filed'}, 				
		{value:"ENGA"	, label:'Engaged'}, 				
		{value:"MARR"	, label:'Marriage'}, 				
		{value:"COMM"	, label:'Common Law Marriage'}, 				
		{value:"MARB"	, label:'Marriage Announced'}, 				
		{value:"MARC"	, label:'Marriage Contract'}, 				
		{value:"MARL"	, label:'Marriage License'}, 				
		{value:"MARS"	, label:'Marriage Settlement'}, 				
		{value:"EVEN"	, label:'Other'}			
	])
		
	.constant("KindiAttrStruct", [
		{value:"NAM"	, label:'Name Change'}, 				
		{value:"DSCR"	, label:'Description'}, 				
		{value:"EDUC"	, label:'Scholastic'}, 				
		{value:"NATI"	, label:'Tribal Origin'}, 				
		{value:"OCCO"	, label:'Occupation'}, 				
		{value:"PROP"	, label:'Possessions'}, 				
		{value:"RELI"	, label:'Religious Affilation'}, 				
		{value:"RESI"	, label:'Residence'}, 				
		{value:"TITL"	, label:'Nobility Title'}, 				
		{value:"CAST"	, label:'Caste'}, 				
		{value:"FACT"	, label:'Other'}, 				
	])

	.constant("KindiEvStruct", [
		{value:"BIR"	, label:'Birth'}, 				
		{value:"DEA"	, label:'Death'}, 				
		{value:"CHR"	, label:'Christening'}, 				
		{value:"BURI"	, label:'Burial'}, 				
		{value:"CREM"	, label:'Cremation'}, 				
		{value:"ADOP"	, label:'Adoption'}, 				
		{value:"BAPM"	, label:'Baptism'}, 				
		{value:"BARM"	, label:'Bar Mitzvah'}, 				
		{value:"BASM"	, label:'Bas Mitzvah'}, 				
		{value:"BLES"	, label:'Blessing'}, 				
		{value:"CHRA"	, label:'Adult Christening'}, 				
		{value:"CONF"	, label:'Confirmation'}, 				
		{value:"FCOM"	, label:'First Communion'}, 				
		{value:"ORDN"	, label:'Naturalization'}, 				
		{value:"NATU"	, label:'Christening'}, 				
		{value:"EMIG"	, label:'Emmigration'}, 				
		{value:"IMMI"	, label:'Immigration'}, 				
		{value:"CENS"	, label:'Census'}, 				
		{value:"PROB"	, label:'Probate'}, 				
		{value:"WILL"	, label:'Will'}, 				
		{value:"GRAD"	, label:'Graduation'}, 				
		{value:"EVEN"	, label:'Other'}, 				
	])
				
	.constant("KdateModifiers", [
		{value:"EXA"	, label:'Exact'}, 				
		{value:"BEF"	, label:'Before'}, 				
		{value:"BET"	, label:'Between'}, 				
		{value:"AFT"	, label:'After'}, 				
		{value:"FRO"	, label:'From'}, 				
		{value:"TO "	, label:'To'}, 				
		{value:"PHR"	, label:'Phrase'}, 				
		{value:"ABT"	, label:'About'}, 				
		{value:"EST"	, label:'Estimated'}, 				
		{value:"CAL"	, label:'Calculated'}, 				
	]);
})
();	