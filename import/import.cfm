<cffile action = "read"  
    	file =  "/Applications/ColdFusionBuilder2016/ColdFusion/cfusion/wwwroot/ancestor/import/import.txt"
    	variable = "theData"
	charset="utf-8">

<cfset dataList = REReplace(theData, "\r\n\n\r|\n|\r", "~", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, ",", "|", "all")>					<!--- protect commas by replacing with | --->
<cfset dataList = replace(dataList, "@@", "@", "all")>					<!--- double at signs not allowed --->

<!---<cfset dataList = replace(dataList," ","`","all")>--->

<cfset dataList = replace(dataList, "~0", " \0", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~1", " \1", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~2", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~3", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~4", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~5", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~6", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~7", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~8", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = replace(dataList, "~", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = REReplace(dataList, "CONT", " ", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = REReplace(dataList, " CONC ", "", "all")>					<!--- replace all EOL chars with || --->
<cfset dataList = dataFixes(dataList)>

<cfset tags = listToArray (dataList, "\0",false,true)>
<cfloop index="i" from="1" to="#arrayLen(tags)#">	
	<cfset tmp = find('INDI',tags[1])>
	<cfif not tmp>
		<cfset arrayDeleteAt(tags,1)>
	<cfelse>	
		<cfbreak>
	</cfif>
</cfloop>

<cfset tag = arrayNew(1)>
<cfset INDI = arrayNew(1)>
<cfset recID = arrayNew(1)>

<!--- now parse each INDI and insert into DB --->

<cfset tag = listToArray (tags[1], "\1",false,true)>

<!---<cfloop index="i" from="1" to="#arrayLen(tags)#">---> 

<cfloop index="i" from="1" to="#5#"> 
	<cfset INDI[i] = mid(tags[i],3,find("@",tags[i],3)-3)>
	<cfset tag = listToArray (tags[i], "\1",false,true)>

<!--- WARNING: --->
<!--- Need to check if INDI exists before insert --->

<cfif debugOff>
	<cfoutput >		
		<cfquery name="AddPerson" result="result" datasource="theData"> 
		    INSERT INTO main 
		        (ownerID)     
		    VALUES  
	    	    (#curUser#) 
		</cfquery>
	</cfoutput>
	<cfset recID[i] = result.GENERATEDKEY>
	<cfset newUser = recID[i]>
</cfif>

<!--- main DB --->

	<cfset getINDI(tag)>

</cfloop>

<cffunction name="getINDI" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="temp1" required="true" type="array"> 

<!---
INDIVIDUAL_RECORD:
+1 RESN <RESTRICTION_NOTICE>
+1 <<PERSONAL_NAME_STRUCTURE>>
+1 SEX <SEX_VALUE>
+1 <<INDIVIDUAL_EVENT_STRUCTURE>>
+1 <<INDIVIDUAL_ATTRIBUTE_STRUCTURE>>  
+1 <<LDS_INDIVIDUAL_ORDINANCE>>
+1 <<CHILD_TO_FAMILY_LINK>>
+1 <<SPOUSE_TO_FAMILY_LINK>>
+1 SUBM @<XREF:SUBM>@
+1 <<ASSOCIATION_STRUCTURE>>
+1 ALIA @<XREF:INDI>@
+1 ANCI @<XREF:SUBM>@
+1 DESI @<XREF:SUBM>@
+1 RFN <PERMANENT_RECORD_FILE_NUMBER> 
+1 AFN <ANCESTRAL_FILE_NUMBER>
+1 REFN <USER_REFERENCE_NUMBER>
+2 TYPE <USER_REFERENCE_TYPE> 
+1 RIN <AUTOMATED_RECORD_ID>
+1 <<CHANGE_DATE>>
+1 <<NOTE_STRUCTURE>>
+1 <<SOURCE_CITATION>> 
+1 <<MULTIMEDIA_LINK>>n EVEN
--->

<!--- WARNING: --->
<!--- Need to check if INDI exists before insert --->

	<cfset var setStr = "">
 	<cfset var tmp = "">
 	<cfset var result = "">

	<cfloop index="i" from="2" to="#arrayLen(temp1)#">
		<cfset tmp = arrayToList(temp1)>
		<cfset tag = listGetAt(tmp,i,",")>
		<cfset tag = ListChangeDelims(tag,","," ")>
		<cfset setStr = "">
		
		<cfset tmp = listContains(tag, "RESN")>	
 		<cfif tmp>
			<cfset setStr &= 'restriction="#trim(listGetAt(tag,tmp+1))#"' & ", ">
		</cfif>

		<cfset tmp = find("NAME", tag)>	
		<cfif tmp>
			<cfset getName(tag,'INDI')>
		</cfif>
		
		<cfset tmp = find("XSEX", tag)>	
	 	<cfif tmp>
			<cfset temp = getParams(tag, tmp)>
			<cfset setStr &= 'gender="#listLast(temp)#"' & ", ">
 		</cfif>
 	
		<cfset tmp = find("FAMC", tag)>	
	 	<cfif tmp>
	  		<cfset setStr &= getChildToFamily(tag,"INDI")>									<!--- check structs for possible input --->
		</cfif>
	
		<cfset tmp = find("FAMS",tag)>	
	 	<cfif tmp>
	  		<cfset setStr &= getSpouseToFamily(tag,"INDI")>									<!--- check structs for possible input --->
		</cfif>
		
		<cfset tmp = find("SUBM", tag)>		
	 	<cfif tmp>
			<cfset setStr &= 'submittedBy="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
		
		<cfset tmp = find("ASSO", tag)>	
 		<cfif tmp>
  			<cfset getAssocStruct(tag,"INDI")>									<!--- check structs for possible input --->
		</cfif>
		
		<cfset tmp = find("ALIA", tag)>	
 		<cfif tmp>
			<cfset setStr &= 'alias="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
		
		<cfset tmp = find("ANCI", tag)>	
 		<cfif tmp>
			<cfset setStr &= 'geneologyInterest="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
		
		<cfset tmp = find("DESI", tag)>	
 		<cfif tmp>
 			<cfset setStr &= 'generalInterest="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
	
		<cfset tmp = find("RFN", tag)>	
	 	<cfif tmp>
			<cfset setStr &= 'permRecNumber="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
	
		<cfset tmp = find("AFN", tag)>	
	 	<cfif tmp>
			<cfset setStr &= 'ancestralFileNumber="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
	
		<cfset tmp = find("REFN", tag)>	
	 	<cfif tmp>
			<cfset setStr &= 'refNumber="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
	
		<cfset tmp = find("TYPE", tag)>	
	 	<cfif tmp>
			<cfset setStr &= 'theType="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
	
		<cfset tmp = find(",RIN,",tag)>	
	 	<cfif tmp>
			<cfset setStr &= 'recID="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		</cfif>
		
		<cfset tmp = find("CHAN", tag)>	
		<cfif tmp>
	  		<cfset getChangeDate(tag)>									<!--- check structs for possible input --->
		</cfif>
	
		<cfset tmp = find("NOTE", tag)>	
	 	<cfif tmp>
	 		<cfset getNote(tag, "individual")>									<!--- check structs for possible input --->
	 	</cfif>
 	
		<cfset tmp = find("SOUR", tag)>	
	 	<cfif tmp>
	  		<cfset getSource(tag)>	
	 	</cfif>	
 		<cfset tmp = find("OBJE", tag)>	
	 	<cfif tmp>
	  		<cfset getMedia(tag)>									<!--- check structs for possible input --->
		</cfif>

 		<cfset getEventStruct(tag, "INDI")>									<!--- check structs for possible input --->
		<cfset getAttrStruct(tag, "INDI")>									<!--- check structs for possible input --->
		<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->		

		<cfif len(setStr) gt 2 and debugOff>	
			<cfoutput>					
				<cfset setStr &= 'ownerID=#curUser#'>
 				<cfquery name="main" result="result" datasource="theData"> 
					UPDATE main
					SET #setStr# WHERE 
					id = #newUser#;
				</cfquery>
			</cfoutput>
		</cfif>
	</cfloop>

<cfreturn>
</cffunction>

<cffunction name="getChildToFamily" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
n FAMC @<XREF:FAM>@
+1 PEDI <PEDIGREE_LINKAGE_TYPE> 
+1 STAT <CHILD_LINKAGE_STATUS> 
+1 <<NOTE_STRUCTURE>>
--->

	<cfset var setStr1 = "">
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
	
 	<cfset tmp = find("FAMC", tag)>	
 	<cfif tmp>
		<cfset setStr1 &= 'famc="#getParams(tag, tmp)#"' & ", ">
	</cfif>

	<cfset tmp = find("PEDI", tag)>	
 	<cfif tmp>
 		<cfset setStr1 &= 'pedigree="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset tmp = find("STAT", tag)>	
 	<cfif tmp>
 		<cfset setStr1 &= 'status="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset tmp = find("NOTE", tag)>	
 	<cfif tmp>
  		<cfset getnote(tag, "family")>									<!--- check structs for possible input --->
	</cfif>

<cfreturn setStr1>
</cffunction>

<cffunction name="getSpouseToFamily" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
SPOUSE_TO_FAMILY_LINK:=
n FAMS @<XREF:FAM>@ {1:1} p.24
+1 <<NOTE_STRUCTURE>>
--->
 
 	<cfset var setStr1 = "">
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("FAMS", tag)>	
 	<cfif tmp>
 		<cfset setStr1 &= 'fams="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset tmp = find("NOTE", tag)>	
 	<cfif tmp>
  		<cfset getnote(tag, "spouse")>									<!--- check structs for possible input --->
	</cfif>

	<cfreturn setStr1> 
</cffunction>

<cffunction name="getRelation" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
NAME Joe /Jacob/
1 ASSO @<XREF:SUBM>@
2 RELA great grandson
--->
	
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("NAME", tag)>	
 	<cfif tmp>
  		<cfset getName(tag,"relation")>									<!--- check structs for possible input --->
	</cfif>
	<cfset tmp = listContains("ASSO", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theAssoc="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset tmp = find("RELA", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theRelation="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
		
	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= '"ownerID="#curUser#"' & ", ">
	 	<cfset setStr &= '"linkID="#newUser#"' & ", ">
	
		<cfoutput>			
			<cfquery name="AddFamily" result="result" datasource="theData"> 
	    		INSERT INTO Family 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset familyID = result.GENERATEDKEY>
		
			<cfquery name="UpdateFamily" result="result" datasource="theData"> 
				UPDATE Family 
				SET #setStr# WHERE 
					id = #familyID#;
			</cfquery>
		</cfoutput>
	</cfif>

<cfreturn> 
</cffunction>

<cffunction name="getAssocStruct" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
ASSOCIATION_STRUCTURE:= 
n ASSO @<XREF:INDI>@
+1 RELA <RELATION_IS_DESCRIPTOR> 
+1 <<SOURCE_CITATION>>
+1 <<NOTE_STRUCTURE>>
--->

	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("ASSO", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'theAssoc="#trim(listGetAt(tag, tmp+1))#"' & ", ">
	</cfif>
	
	<cfset tmp = find("SOUR", tag)>	
 	<cfif tmp>
  		<cfset getSource(tag,"assoc")>									<!--- check structs for possible input --->
	</cfif>
	
	<cfset tmp = find("RELA", tag)>	
 	<cfif tmp>
  		<cfset result = getRelation(tag,"assoc")>									<!--- check structs for possible input --->
		<cfset setStr &= 'theRelation="#trim(listGetAt(tag, tmp+1))#"' & ", ">
	</cfif>
	
	<cfset tmp = find("NOTE", tag)>	
 	<cfif tmp>
  		<cfset getNote(tag, "association")>									<!--- check structs for possible input --->
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
		
	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= '"ownerID="#curUser#"' & ", ">
	
		<cfoutput>			
			<cfquery name="AddFamily" result="result" datasource="theData"> 
	    		INSERT INTO Family 
	        		(theAssoc)     
	    		VALUES  
	    		    (" ") 
			</cfquery>
			<cfset familyID = result.GENERATEDKEY>
		
			<cfquery name="UpdateFamily" result="result" datasource="theData"> 
				UPDATE Family 
				SET #setStr# WHERE 
					id = #familyID#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getDate" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="tmp" required="true" type="list"> 

<!---
DATE_VALUE:= [
<DATE> |
	<DATE_CALENDAR>
	 	<DATE_GREG> | <DATE_JULN> | <DATE_HEBR> | <DATE_FREN> |<DATE_FUTURE> ]
<DATE_PERIOD> | <DATE_RANGE>| <DATE_APPROXIMATED> |
INT <DATE> (<DATE_PHRASE>) | (<DATE_PHRASE>)
--->
 
 	<cfset var setStr1 = "">
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp1 = "">
 	<cfset var tmp2 = "">
 	<cfset var firstDate = "">
 	<cfset var secondDate = "">
 	
 	<cfset temp1 = replace(tag,"DATE","date")>								<!--- lcase current DATE to ignore in later searches on the tag. i.e. fix multiple DATE in a tag--->
	<cfset temp1 = getParams(tag, tmp)>
	<cfif listLen(temp1, " ,") is 1>											<!--- ***have just a date with no modifier --->
  		<cfset setStr1 = 'theDate1="#listChangeDelims(temp1,"-"," ,")#"' & ", ">
 	</cfif>	
	
	<cfset tmp1 = find("from",temp1)>							<!--- ***have a date range, note that FROM is made lowercase earlier to fix collision in getParams --->
	<cfset tmp2 = find("TO",temp1)>								<!--- have a date range,  --->
	<cfif tmp1 and tmp2>	
 		<cfset setStr1 &= 'theDateMod="range", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ,")>				<!--- the delimiter , is necessary to fix common bug of comma between modifier and date --->
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
		<cfset firstDate = listGetAt(temp1,1,"-") & "-" & listGetAt(temp1,2,"-") & "-" & listGetAt(temp1,3,"-")>
		<cfset secondDate = listGetAt(temp1,5,"-") & "-" & listGetAt(temp1,6,"-") & "-" & listGetAt(temp1,7,"-")>
 		<cfset setStr1 &= 'theDate1="#firstDate#"' & ", ">
  		<cfset setStr1 &= 'theDate2="#secondDate#"' & ", ">
	</cfif>

 	<cfif tmp2 and not find("from",tag)>						<!--- ***have date period but only TO date --->
		<cfset setStr1 &= 'theDateMod="to", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ,")>				<!--- the delimiter , is necessary to fix common bug of comma between modifier and date --->
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
  		<cfset setStr1 &= 'theDate1="#temp1#"' & ", ">
	</cfif>

 	<cfif tmp1 and not find( "TO",tag)>							<!--- ***have date period but only FROM date --->
		<cfset setStr1 &= 'theDateMod="from", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ,")>				<!--- the delimiter , is necessary to fix common bug of comma between modifier and date --->
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
  		<cfset setStr1 &= 'theDate1="#temp#"' & ", ">
	</cfif>
		
	<cfset tmp = find("AFT",tag)>
 	<cfif tmp>															<!--- ***have date AFTER --->		
		<cfset setStr1 &= 'theDateMod="after", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ,")>				<!--- the delimiter , is necessary to fix common bug of comma between modifier and date --->
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
 		<cfset setStr1 &= 'theDate1="#temp1#"' & ", ">
	</cfif>		
 		
	<cfset tmp = find("BEF",tag)>
 	<cfif tmp>															<!--- ***have date BEFORE --->
		<cfset temp1 = listChangeDelims(temp1,"-"," ,")>				<!--- the delimiter , is necessary to fix common bug of comma between modifier and date --->
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
 		<cfset setStr1 &= 'theDate1="#temp1#"' & ", ">
 	</cfif>	

	<cfset tmp1 = find("BET",tag)>
	<cfset tmp2 = find("AND",tag)>
	<cfif tmp1 and tmp2>												<!--- ***have date BETWEEN --->
		<cfset setStr1 &= 'theDateMod="between", '>
 		<cfset temp1 = listChangeDelims(temp1,"-"," ")>
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
		<cfset firstDate = listGetAt(temp1,1,"-") & "-" & listGetAt(temp1,2,"-") & "-" & listGetAt(temp1,3,"-")>
		<cfset secondDate = listGetAt(temp1,5,"-") & "-" & listGetAt(temp1,6,"-") & "-" & listGetAt(temp1,7,"-")>
 		<cfset setStr1 &= 'theDate1="#firstDate#"' & ", ">
  		<cfset setStr1 &= 'theDate2="#secondDate#"' & ", ">
	</cfif>
 	
	<cfset tmp = find("(",tag,tmp)>											<!--- the mid function is to make sure the text is "DATE (" --->
	<cfif tmp and mid(tag,tmp-5,4) is "DATE">	
		<cfset temp1 = listDeleteAt(temp1,1,"(")>	
		<cfset temp1 = left(temp1,len(temp1)-1)>							<!--- ***have date phrase --->
		<cfset setStr1 &= 'theDateMod="Phrase", '>
  		<cfset setStr1 &= 'thePhrase="#temp1#"' & ", ">
  	</cfif>
  	
	<cfset tmp = find("ABT",tag)>
	<cfif tmp>															<!--- ***have date about --->
		<cfset setStr &= 'theDateMod="about", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ")>
		<cfset temp = listDeleteAt(temp1,1,"-")>
 		<cfset setStr &= 'theDate1="#temp1#"' & ", ">
 	</cfif>
 	
 	<cfset tmp = find("CAL",tag)>
	<cfif tmp>															<!--- ***have date calculated --->
 		<cfset setStr1 &= 'theDateMod="calculated", '>
 		<cfset temp1 = listChangeDelims(temp1,"-"," ")>
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
 		<cfset setStr1 &= 'theDate1="#temp1#"' & ", ">
 	</cfif>
	
	<cfset tmp = find("EST",tag)>
	<cfif tmp>															<!--- ***have date estimate --->
		<cfset setStr1 &= 'theDateMod="estimated", '>
		<cfset temp1 = listChangeDelims(temp1,"-"," ")>
		<cfset temp1 = listDeleteAt(temp1,1,"-")>
        <cfset setStr1 &= 'theDate1="#temp1#"' & ", ">
	</cfif>

<cfreturn setStr1> 
</cffunction>

<cffunction name="parseDate" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="tmp" required="true" type="numeric"> 
 
 	<cftry>
 		<cfset temp2 = getParams(tag, tmp)>
		<cfset temp2 = listDeleteAt(temp2,1)>
 		<cfif not isNumeric(listFirst(temp2))>
  			<cfset temp2 = listDeleteAt(temp2,1)>
 		</cfif>
 		<cfset temp2 = listChangeDelims(temp2,"-")>
		<cfcatch>
 		</cfcatch> 
 	</cftry>
 <cfreturn temp2> 
</cffunction>

<cffunction name="getChangeDate" output="true" access="public"  hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
n CHAN
+1 DATE <CHANGE_DATE> 
+2 TIME <TIME_VALUE>
+1 <<NOTE_STRUCTURE>>
--->
	
	<cfset var setStr1 = "">
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = listContains(tag,"CHAN")>	
 	<cfif tmp>
		<cfset setStr1 &= 'changeDay="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		<cfset setStr1 &= 'chanMonth="#trim(listGetAt(tag, tmp+2))#"' & ", ">
		<cfset setStr1 &= 'chanYear="#trim(listGetAt(tag, tmp+3))#"' & ", ">
		<cfset setStr1 &= 'chanTime="#trim(listGetAt(tag, tmp+4))#"' & ", ">
		<cfset getnote(tag, "date of change")>									<!--- check structs for possible input --->
	</cfif>
	<cfreturn setStr1> 
</cffunction>
 	
<cffunction name="getEventDetail" output="true" access="public" hint="parsed all Event items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="type" required="true" type="string"> 

<!---
EVENT_DETAIL:
TYPE <EVENT_OR_FACT_CLASSIFICATION> 
n DATE <DATE_VALUE>
n <<PLACE_STRUCTURE>>
n <<ADDRESS_STRUCTURE>>
n AGNC <RESPONSIBLE_AGENCY>
n RELI <RELIGIOUS_AFFILIATION>
n CAUS <CAUSE_OF_EVENT>
n RESN <RESTRICTION_NOTICE>
n <<NOTE_STRUCTURE>>
n <<SOURCE_CITATION>>
n <<MULTIMEDIA_LINK>>
n AGE <AGE_AT_EVENT>
--->

	<cfset var setStr = "">
	<cfset var result = "">
	<cfset var tmp = "">

 	<cfset tmp = find("TYPE",tag)>	
 	<cfif tmp>
   		<cfset setStr &= 'eventType="#getParams(tag,tmp)#"' & ", ">
 	</cfif>
	
	<cfset tmp = find("DATE",tag)>	
 	<cfif tmp>
  		<cfset setStr &= getDate(tag, tmp)>		
	</cfif>

	<cfset tmp = find("PLAC",tag)>
  	<cfif tmp>
   		<cfset getPlace(tag)>
 	</cfif>
	
	<cfset tmp = find("ADDR",tag)>	
  	<cfif tmp>
 		<cfset getAddr(tag)>
	</cfif>
	
	<cfset tmp = find("AGNC",tag)>	
  	<cfif tmp>
   		<cfset setStr &= 'theAgency="#getParams(tag,tmp)#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("RELI",tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theReligion="#getParams(tag,tmp,4)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("CAUS",tag)>	
 	<cfif tmp>
   		<cfset setStr &= 'theCause="#getParams(tag,tmp,4)#"' & ", ">
	</cfif>
	
	<cfset tmp = find("RESN",tag)>	
  	<cfif tmp>
   		<cfset setStr &= 'theRestriction="#getParams(tag,tmp,4)#"' & ", ">
	</cfif>

 	<cfset tmp = find("NOTE",tag)>	
 	<cfif tmp>
		<cfset getnote(tag, type)>
	</cfif>
	
	<cfset tmp = find("SOUR",tag)>	
 	<cfif tmp>
 		<cfset getSource(tag)>
	</cfif>
	
 	<cfset tmp = find(",AGE,",tag)>	
 	<cfif tmp>
   		<cfset setStr &= 'theAge="#getAge(tag)#"' & ", ">
	</cfif>

	<cfset tmp = find("OBJE",tag)>	
 	<cfif tmp>
		<cfset getMedia(tag)>
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
	
	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= 'ownerID=#curUser#' & ", ">
	 	<cfset setStr &= 'linkID=#newUser#' & ", ">
	 	<cfset setStr &= 'theType="#type#"'>
 		<cfoutput>			
			<cfquery name="AddEvent" result="result" datasource="theData"> 
	    		INSERT INTO Events
	        		(ownerID, linkID)     
	    		VALUES  
				    (#curUser#, #newUser#) 
			</cfquery>
			<cfset eventID = result.GENERATEDKEY>
		
			<cfquery name="UpdateEvent" result="result" datasource="theData"> 
				UPDATE Events
				SET #setStr# WHERE 
					id = #eventID#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getEventStruct" output="true" access="public" hint="parse all Event items from tag list" > 
   <cfargument name="tag" required="true" type="list"> 

<!---
n [ BIRT | CHR ] [Y|<NULL>]
+1 <<INDIVIDUAL_EVENT_DETAIL>> 
+1 FAMC @<XREF:FAM>@
n DEAT [Y|<NULL>]
+1 <<INDIVIDUAL_EVENT_DETAIL>> |
n [BURI|CREM]
+1 <<INDIVIDUAL_EVENT_DETAIL>> 
n ADOP
+1 <<INDIVIDUAL_EVENT_DETAIL>> 
+1 FAMC @<XREF:FAM>@
+2 ADOP <ADOPTED_BY_WHICH_PARENT>
n [BAPM|BARM|BASM|BLES]
+1 <<INDIVIDUAL_EVENT_DETAIL>>
n [CHRA|CONF|FCOM|ORDN]
+1 <<INDIVIDUAL_EVENT_DETAIL>>
n [NATU|EMIG|IMMI]
+1 <<INDIVIDUAL_EVENT_DETAIL>>
n [ CENS | PROB | WILL]
+1 <<INDIVIDUAL_EVENT_DETAIL>> 
[ GRAD | RETI ]
+1 <<INDIVIDUAL_EVENT_DETAIL>> 
n EVEN
+1 <<INDIVIDUAL_EVENT_DETAIL>>
--->
 	
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
   <cfset tmp = find("BIRT", tag)>
	<cfif tmp>
		<cfset getEventDetail(tag, "birth")>
	</cfif>

   	<cfset tmp = find("FAMC", tag)>
	<cfif tmp>
  		<cfset getEventDetail(tag,"family")>
	</cfif>
	
 	<cfset tmp = find("CHR", tag)>
 	<cfif tmp>
 		<cfset getEventDetail(tag,"christening")>
	</cfif>
	
  	<cfset tmp = find("DEAT", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"death")>
	</cfif>
	
  	<cfset tmp = find("BURI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"burial")>
	</cfif>
	
 	<cfset tmp = find("CREM", tag)>
 	<cfif tmp>
		<cfset getEventDetail(tag,"cremation")>
	</cfif>
	
  	<cfset tmp = find("ADOP", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"adoption")>
	</cfif>
 	<cfset tmp = find("BAPM", tag)>
 	
 	<cfif tmp>
 		<cfset getEventDetail(tag,"baptism")>
	</cfif>
	
  	<cfset tmp = find("BARM", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"barmitzvah")>
	</cfif>
	
 	<cfset tmp = find("BASM", tag)>
 	<cfif tmp>
 		<cfset getEventDetail(tag,"basmitzvah")>
	</cfif>
	
  	<cfset tmp = find("BLES", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"blessing")>
	</cfif>
	
 	<cfset tmp = find("CHRA", tag)>
 	<cfif tmp>
 		<cfset getEventDetail(tag,"adult christening")>
	</cfif>
	
  	<cfset tmp = find("CONF", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"confirmation")>
	</cfif>
	
 	<cfset tmp = find("FCOM", tag)>
 	<cfif tmp>
 		<cfset getEventDetail(tag,"first communion")>
	</cfif>
	
 	<cfset tmp = find("ORDN", tag)> 	
 	<cfif tmp>
 		<cfset getEventDetail(tag,"ordination")>
	</cfif>
	
  	<cfset tmp = find("NATU", tag)> 	
	<cfif tmp>
 		<cfset getEventDetail(tag, "naturalization")>
	</cfif>
	
  	<cfset tmp = find("EMIG", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"emmigration")>
	</cfif>
 	
 	<cfset tmp = find("IMMI", tag)>	
 	<cfif tmp>
 		<cfset getEventDetail(tag,"immigration")>
	</cfif>

 	<cfset tmp = find("CENS", tag)>
  	<cfif tmp>
		<cfset getCensus(tag,"census")>
 	</cfif>
	
 	<cfset tmp = find("PROB", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"probate")>
	</cfif>
	
 	<cfset tmp = find("WILL", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag,"will")>
	</cfif>

<cfreturn> 
</cffunction>

<cffunction name="getName" output="true" access="public" hint="parsed all NAME items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
 
<!---
NAME <NAME_PERSONAL>
+1 TYPE <NAME_TYPE>
+1 <<PERSONAL_NAME_PIECES>> 
n NPFX <NAME_PIECE_PREFIX>
n GIVN <NAME_PIECE_GIVEN>
n NICK <NAME_PIECE_NICKNAME>
n SPFX <NAME_PIECE_SURNAME_PREFIX
n SURN <NAME_PIECE_SURNAME> 
n NSFX <NAME_PIECE_SUFFIX>
n <<NOTE_STRUCTURE>>    see getNote cffunction
n <<SOURCE_CITATION>>   see getSource cffunction
--->

  	<cfset var haveName = false>
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	<cfset var temp1 = "">
 	<cfset var prefixes = "Mr., Ms., Dr., Miss., Mrs.">		

	<cfset tmp = find("NAME", tag)>
	<cfif tmp and listLen(tag,"/") gt 2>
		<cfset temp1 = getParams(tag, tmp)>		
		<cfif listLen(temp1,"/") is 3>										<!--- have name suffix --->
			<cfset setStr &= 'nameSuffix="#listLast(temp1,"/")#"' & ", ">
			<cfset temp1 = listDeleteAt(temp1,listLen(temp1),"/")>
		</cfif>
		<cfset setStr &= 'lastName="#listGetAt(temp1,2,"/")#"' & ", ">		<!---set last name --->
		<cfset temp1 = listDeleteAt(temp1,listLen(temp1,"/"),"/")>
	
		<cfset tmp = listContains(prefixes,listGetAt(temp1,1,"/"), " ")>		<!--- check for name prefixes --->
		<cfif tmp>
			<cfset setStr &= 'namePrefix="#listFirst(listFirst(temp1,"/")," ")#"' & ", ">
			<cfset temp1 = listDeleteAt(temp1,2)>
		</cfif>	
		<cfset setStr &= 'firstName="#listGetAt(temp1,1," ")#"' & ",">
		<cfset temp1 = listDeleteAt(temp1,1," ")>
		<cfif listLen(temp1," ") gt 0>
			<cfset setStr &= 'middleName="#listLast(temp1," ")#"' & ",">
			<cfset temp1 = listDeleteAt(temp1,listLen(temp1," ")," ")>
		</cfif>
	<cfelseif tmp>
		<cfset setStr &= 'lastName="#listLast(temp1,"/")#"' & ", ">
	</cfif>

 	<cfset tmp = find("NPFX", tag)>
 	<cfif tmp>
		<cfset setStr &= 'namePrefix="#getParams(tag, tmp)#"' & ", ">
 	</cfif>
 	<cfset tmp = find("SPFX", tag)>
 	<cfif tmp>
		<cfset setStr &= 'surnamePrefix="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("NSFX", tag)>
 	<cfif tmp>
		<cfset setStr &= 'nameSuffix="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("TYPE", tag)>
 	<cfif tmp>
		<cfset setStr &= 'theType="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find(tag,"SURN")>
 	<cfif tmp and not haveName>
		<cfset setStr &= 'lastName="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
	<cfset tmp = find(tag,"GIVN")>
 	<cfif tmp and not haveName>
		<cfset setStr &= 'firstName="#getParams(tag, tmp)#"' & ", ">
 	</cfif>
 	
	<cfset tmp = find(tag,"NOTE")>
 	<cfif tmp>
		<cfset getnote(tag, "name")>
 	</cfif>
 	
	<cfset tmp = find(tag,"SOURCE")>
 	<cfif tmp>
		<cfset getSource(tag, "name")>
 	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->

<!--- Write the name values to the main DB --->

	<cfif len(setStr) gt 2 and debugOff>	
	 	<cfset setStr &= 'ownerID=#curUser#'>
	 	
		<cfoutput>	
			<cfif newUser is 0>		
				<cfquery name="AddPerson" result="result" datasource="theData"> 
	    			INSERT INTO main 
	        			(ownerID)     
	    			VALUES  
	    			    (#curUser#) 
				</cfquery>
				<cfset newUser = result.GENERATEDKEY>
			<cfelse>											<!--- have multiple names --->
	 			<cfset setStr &= ', namesID=#newUser#'>
			</cfif>
		
			<cfquery name="UpdatePerson" result="result" datasource="theData"> 
				UPDATE main 
				SET #setStr# WHERE 
					id = #newUser#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getAge" output="true" access="public"  hint="parsed all BIRT items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
AGE_AT_EVENT:=
[ < | > | <NULL>]
[ YYy MMm DDDd | YYy | MMm | DDDd |
YYy MMm | YYy DDDd | MMm DDDd |
CHILD | INFANT | STILLBORN ] ]
 --->
	
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var temp1 = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find(",AGE,",tag)>													<!--- the commas are to select just AGE and not (P)AGE --->	
	<cfset temp1 = getParams(tag, tmp)>		
	<cfset temp1 = listDeleteAt(temp1,1)>
	<cfset temp1 = ListChangeDelims(temp1," ")>

	<cfset tmp = find(tag,"y")>	
	<cfif tmp and listGetAt(tag, tmp+1) is "m" and listGetAt(tag, tmp+2) is "d">
 		<cfset setStr &= 'theYears="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		<cfset setStr &= 'theMonths="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		<cfset setStr &= 'theDays="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>

 	<cfset tmp = find("d", tag)>	
	<cfif tmp and listGetAt(tag, tmp+1) is "d">
 		<cfset setStr &= 'theYears="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		<cfset setStr &= 'theDays="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("d", tag)>	
	<cfif tmp and listGetAt(tag, tmp+1) is "d">
		<cfset setStr &= 'theYears="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 		<cfset setStr &= 'theYDays="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("m", tag)>	
	<cfif tmp and listGetAt(tag, tmp+1) is "d">
 		<cfset setStr &= 'theYears="#trim(listGetAt(tag, tmp+1))#"' & ", ">
		<cfset setStr &= 'theMonths="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("y", tag)>	
	<cfif tmp and (listGetAt(tag, tmp+1) does not contain "m") and (listGetAt(tag, tmp+1) does not contain "d")>
		<cfset setStr &= 'theAge="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("m", tag)>	
 	<cfif tmp and (listGetAt(tag, tmp+1) does not contain "d") and (listGetAt(tag, tmp+2) does not contain "y")>
		<cfset setStr &= 'theAge="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("d", tag)>	
 	<cfif tmp and (listGetAt(tag, tmp+1) does not contain "m") and (listGetAt(tag, tmp+2) does not contain "y")>
		<cfset setStr &= 'theAge="#trim(listGetAt(tag, tmp+1))#"' & ", ">
 	</cfif>
	
 	<cfset tmp = find("<", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'ageModifier="<", '>
	</cfif>
	
 	<cfset tmp = find(">", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'ageModifier=">", '>
	</cfif>
	
 	<cfset tmp = find("child", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'theType="child, '>
	</cfif>
	
 	<cfset tmp = find("infant", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'theType="infant, '>
	</cfif>
	
 	<cfset tmp = find("stillborn", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'theType="stillborn", '>
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->

	<cfif len(setStr) and debugOff>	
 		<cfset setStr &= '"ownerID="#curUser#"' & ", ">
 		<cfset setStr &= '"linkID="#newUser#"'>
 	
		<cfoutput>			
			<cfquery name="AddAge" result="result" datasource="theData"> 
	    		INSERT INTO Ages 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset ageID = result.GENERATEDKEY>
		
			<cfquery name="UpdateAge" result="result" datasource="theData"> 
				UPDATE Ages 
				SET #setStr# WHERE 
					id = #ageID#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getDeath" output="true" access="public"  hint="parsed all DEAT items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
 
<!---
n DEAT [Y|<NULL>]
+1 <<INDIVIDUAL_EVENT_DETAIL>> |   	see getEventDetail cffunction
n [BURI|CREM]
+1 <<INDIVIDUAL_EVENT_DETAIL>> |
 --->

	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("DEAT", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "death")>
	</cfif>

	<cfset tmp = find("BURI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "burial")>
	</cfif>

	<cfset tmp = find("CREM", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "cremation")>
	</cfif>

<cfreturn > 
</cffunction>

<cffunction name="getBirth" output="true" access="public"  hint="parsed all BIRT items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
BIRT | CHR ] [Y|<NULL>]
+1 <<INDIVIDUAL_EVENT_DETAIL>>   	see getEventStruct cffunction
+1 FAMC @<XREF:FAM>@

--->

 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("BIRT", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "birth")>
	</cfif>
 
	<cfset tmp = find("CHR", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "christening")>
	</cfif>
 
	<cfset tmp = find("FAMC",tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "family link")>
	</cfif>
 
 	<cfreturn> 
</cffunction>

<cffunction name="getAttrStruct" output="true" access="public" hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
	TYPE text
	CAST <CASTE_NAME>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n DSCR <PHYSICAL_DESCRIPTION>
		+1 [CONC | CONT ] 
	<PHYSICAL_DESCRIPTION> 
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n EDUC <SCHOLASTIC_ACHIEVEMENT>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n IDNO <NATIONAL_ID_NUMBER>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n NATI <NATIONAL_OR_TRIBAL_ORIGIN>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n NCHI <COUNT_OF_CHILDREN>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n NMR <COUNT_OF_MARRIAGES>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n OCCU <OCCUPATION>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n PROP <POSSESSIONS>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n RELI <RELIGIOUS_AFFILIATION>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n RESI /* Resides at */
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n SSN <SOCIAL_SECURITY_NUMBER>
		+1 <<INDIVIDUAL_EVENT_DETAIL>> 
	n TITL <NOBILITY_TYPE_TITLE>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
	n FACT <ATTRIBUTE_DESCRIPTOR>
		+1 <<INDIVIDUAL_EVENT_DETAIL>>
--->

	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("TYPE", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "type")>
	</cfif>
 
	<cfset tmp = find("CAST", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "caste")>
	</cfif>
 
	<cfset tmp = find("DESC", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "description")>
	</cfif>
 
	<cfset tmp = find("EDUC", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "education")>
	</cfif>
 
	<cfset tmp = find("IDNO", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "ID number")>
	</cfif>
 
	<cfset tmp = find("NATI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "nationality")>
	</cfif>
 
	<cfset tmp = find("NCHI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "number of children")>
	</cfif>
 
	<cfset tmp = find("NMR", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "number of marriages")>
	</cfif>
 
	<cfset tmp = find("OCCU", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "occupation")>
	</cfif>
 
	<cfset tmp = find("PROP", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "property")>
	</cfif>
 
	<cfset tmp = find("RELI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "religion")>
	</cfif>
 
	<cfset tmp = find("RESI", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "residence")>
	</cfif>
 
	<cfset tmp = find("SSN", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "ssn")>
	</cfif>
 
	<cfset tmp = find("TITL", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "nobility")>
	</cfif>
 
	<cfset tmp = find("FACT", tag)>
	<cfif tmp>
 		<cfset getEventDetail(tag, "fact")>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getLDSord" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
n [ BAPL | CONL ]
+1 DATE <DATE_LDS_ORD>
+1 TEMP <TEMPLE_CODE>
+1 PLAC <PLACE_LIVING_ORDINANCE> 
+1 STAT <LDS_BAPTISM_DATE_STATUS>
+2 DATE <CHANGE_DATE> 
+1 <<NOTE_STRUCTURE>>
+1 <<SOURCE_CITATION>>
|
n ENDL
+1 DATE <DATE_LDS_ORD>
+1 TEMP <TEMPLE_CODE>
+1 PLAC <PLACE_LIVING_ORDINANCE>
+1 STAT <LDS_ENDOWMENT_DATE_STATUS>
+2 DATE <CHANGE_DATE> 
+1 <<NOTE_STRUCTURE>>
+1 <<SOURCE_CITATION>>

n SLGC
1 DATE <DATE_LDS_ORD>
+1 TEMP <TEMPLE_CODE>
+1 PLAC <PLACE_LIVING_ORDINANCE>
+1 FAMC @<XREF:FAM>@
+1 STAT <LDS_CHILD_SEALING_DATE_STATUS>
+2 DATE <CHANGE_DATE> 
+1 <<NOTE_STRUCTURE>>
+1 <<SOURCE_CITATION>>

LDS_SPOUSE_SEALING:= 
n SLGS
+1 DATE <DATE_LDS_ORD>
+1 TEMP <TEMPLE_CODE>
+1 PLAC <PLACE_LIVING_ORDINANCE>
]
STAT <LDS_SPOUSE_SEALING_DATE_STATUS> 
+2 DATE <CHANGE_DATE>
+1 <<NOTE_STRUCTURE>> 
+1 <<SOURCE_CITATION>>
--->
 
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("BAPL", tag)>	
 	<cfif tmp>
 		<cfset getLDSDetail(tag,"bapl")>
	</cfif>
	
	<cfset tmp = find("CONL", tag)>	
 	<cfif tmp>
 		<cfset getLDSDetail(tag,"conl")>
 	</cfif>
 	
	<cfset tmp = find("ENDL",tag)>	
 	<cfif tmp>
 		<cfset getLDSDetail(tag,"endl")>
 	</cfif>
 	
 	<cfset tmp = find("SLGC", tag)>	
 	<cfif tmp>
 		<cfset getLDSDetail(tag,"slgc")>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getLDSDetail" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="type" required="true" type="string"> 
 
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
 	<cfset tmp = find(tag,"TEMP")>	
 	<cfif tmp>
		<cfset setStr &= 'theTemple="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find(tag,"PLAC")>	
 	<cfif tmp>
		<cfset getPlace(tag)>
	</cfif>
	
 	<cfset tmp = find(tag,"STAT")>	
 	<cfif tmp>
		<cfset setStr &= 'theStatus="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find(tag,"DATE")>	
 	<cfif tmp>
		<cfset setStr &= getDate(tag, tmp)>
	</cfif>
	
 	<cfset tmp = find(tag,"NOTE")>	
 	<cfif tmp>
		<cfset getNotes(tag, newUser, "LDS")>
	</cfif>
	
 	<cfset tmp = find(tag,"SOUR")>	
 	<cfif tmp>
		<cfset getSource(tag,"LDS")>
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
		
	<cfif len(setStr) and debugOff>	
  		<cfset setStr &= '"theType="#type#"' & ", ">
		<cfset setStr &= '"ownerID="#curUser#"' & ", ">
		<cfset setStr &= '"linkID="#newUser#"'>
  	
		<cfoutput>			
			<cfquery name="AddEvent" result="result" datasource="theData"> 
	    		INSERT INTO Event 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset eventID = result.GENERATEDKEY>
		
			<cfquery name="UpdateEvent" result="result" datasource="theData"> 
				UPDATE Event 
				SET #setStr# WHERE 
				id = #eventID#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getCensus" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
 
<!---
n CENS
+1 <<INDIVIDUAL_EVENT_DETAIL>>
[ GRAD | RETI ]
--->

 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
	<cfset tmp = find("CENS", tag)>	
 	<cfif tmp>
		<cfset getEventDetail(tag, "census")>
	</cfif>
	
 	<cfset tmp = find("AGE", tag)>	
 	<cfif tmp>
		<cfset getEventDetail(tag, "age")>
	</cfif>
	
 	<cfset tmp = find("GRAD", tag)>	
 	<cfif tmp>
		<cfset getEventDetail(tag, "graduation")>
	</cfif>
	
 	<cfset tmp = find("RETI", tag)>	
 	<cfif tmp>
		<cfset getEventDetail(tag, "retirement")>
	</cfif>
	
<cfreturn> 
</cffunction>

 <cffunction name="getAddr" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
 
<!---
ADDR <ADDRESS_LINE>
+1 CONT <ADDRESS_LINE>
+1 ADR1 <ADDRESS_LINE1>
+1 ADR2 <ADDRESS_LINE2>
+1 ADR3 <ADDRESS_LINE3>
+1 CITY <ADDRESS_CITY>
+1 STAE <ADDRESS_STATE>
+1 POST <ADDRESS_POSTAL_CODE> 
+1 CTRY <ADDRESS_COUNTRY>
n PHON <PHONE_NUMBER>
n EMAIL <ADDRESS_EMAIL>
n FAX <ADDRESS_FAX>
n WWW <ADDRESS_WEB_PAGE> 
--->
 
 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
 	<cfset tmp = find("ADDR", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theADDR="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
	<cfset tmp = find("ADDR1", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theADDR1="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("ADDR2", tag)>	
 	<cfif tmp>
 		<cfset setStr &= 'theADR2="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("ADDR3", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theAddr3="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
	<cfset tmp = find("CITY", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theCity="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("STAT", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theState="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("POST", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theZIP="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("CTRY",tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theCountry="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("PHON", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'thePhone="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("EMAIL", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theEmail="#getParams(tag,tmp)#"' & ", ">
	</cfif>
		
 	<cfset tmp = find("FAX", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theFAX="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("WWW", tag)>	
 	<cfif tmp>
  		<cfset setStr &= 'theWWW="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
		
	<cfif len(setStr) and debugOff>	
 		<cfset setStr &= '"ownerID="#curUser#"' & ", ">
	 	<cfset setStr &= '"linkID="#newUser#"'>
 	
		<cfoutput>			
			<cfquery name="Address" result="result" datasource="theData"> 
    			INSERT INTO Addresses 
    	    		(ownerID, linkId)     
    			VALUES  
    			    (#curUser#, #newUser#) 
			</cfquery>
			<cfset addressID = result.GENERATEDKEY>
		
			<cfquery name="UpdateAddress" result="result" datasource="theData"> 
				UPDATE Addresses 
				SET #setStr# WHERE 
					id = #addressID#;
			</cfquery>
		</cfoutput>
	</cfif>

<cfreturn> 
</cffunction>

 <cffunction name="getSource" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
  
<!---
n @<XREF:SOUR>@ SOUR
+1 DATA
+2 EVEN <EVENTS_RECORDED>
+3 DATE <DATE_PERIOD>
+3 PLAC <SOURCE_JURISDICTION_PLACE>
+2 AGNC <RESPONSIBLE_AGENCY>
+2 <<NOTE_STRUCTURE>>
+1 AUTH <SOURCE_ORIGINATOR>
+2 [CONC|CONT] <SOURCE_ORIGINATOR> 
+1 TITL <SOURCE_DESCRIPTIVE_TITLE>
+2 [CONC|CONT] <SOURCE_DESCRIPTIVE_TITLE> 
+1 ABBR <SOURCE_FILED_BY_ENTRY>
+1 PUBL <SOURCE_PUBLICATION_FACTS>
+2 [CONC|CONT] <SOURCE_PUBLICATION_FACTS> 
+1 TEXT <TEXT_FROM_SOURCE>
+2 [CONC|CONT] <TEXT_FROM_SOURCE> 
+1 <<SOURCE_REPOSITORY_CITATION>> 
+1 REFN <USER_REFERENCE_NUMBER>
+2 TYPE <USER_REFERENCE_TYPE>
+1 RIN <AUTOMATED_RECORD_ID>
+1 <<CHANGE_DATE>>
+1 <<NOTE_STRUCTURE>> +1 <<MULTIMEDIA_LINK>>

--- or   

SOUR <SOURCE_DESCRIPTION>
+1 [CONC|CONT] <SOURCE_DESCRIPTION> +1 TEXT <TEXT_FROM_SOURCE>
+2 [CONC|CONT] <TEXT_FROM_SOURCE> +1 <<MULTIMEDIA_LINK>>
+1 <<NOTE_STRUCTURE>>
+1 QUAY <CERTAINTY_ASSESSMENT>
+--->
  
	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 
 
	<cfset tmp = find("SOUR", tag)>
	<cfif tmp>
 		<cfset setStr &= 'theSource="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
	<cfset tmp = find("PLAC", tag)>
	<cfif tmp>
		<cfset getPlace(tag)>
 	</cfif>

	<cfset tmp = find("PAGE", tag)>
	<cfif tmp>
		<cfset setStr &= 'thePage="#getParams(tag,tmp)#"' & ", ">
 	</cfif>
 	
	<cfset tmp = find("EVEN", tag)>
	<cfif tmp>
		<cfset setStr &= 'theEvent="#getParams(tag,tmp)#"' & ", ">
 	</cfif>
 	
	<cfset tmp = find("ROLE", tag)>
	<cfif tmp>
		<cfset setStr &= 'theRole="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("DATE", tag)>	
 	<cfif tmp>
 		<cfset setStr &= getDate(tag, tmp)>
	</cfif>
	<cfset tmp = find("TEXT",tag)>							<!--- is different since need absolute position in full string --->
	<cfif tmp>
		<cfset setStr &= 'theText="#getParams(tag,tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("OBJE", tag)>	
 	<cfif tmp>
 		<cfset getMedia(tag)>
	</cfif>
	
 	<cfset tmp = find("NOTE", tag)>	
 	<cfif tmp>
 		<cfset getnote(tag, "source")>
		</cfif>
	
	<cfset tmp = find("QUAY", tag)>
	<cfif tmp>
		<cfset setStr &= 'theQuality="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->

 	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= 'ownerID="#curUser#"' & ", ">
		<cfset setStr &= 'linkID="#newUser#"'>
		<cfoutput>			
			<cfquery name="AddSource" result="result" datasource="theData"> 
	    		INSERT INTO Sources 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset sourceID = result.GENERATEDKEY>
			<cfquery name="UpdateSource" result="result" datasource="theData"> 
				UPDATE Sources 
				SET #setStr# WHERE 
					id = #sourceID#;
			</cfquery>
		</cfoutput>
	</cfif>
	
<cfreturn> 
</cffunction>

<cffunction name="getNote" output="true" access="public"  hint="parse all NOTE items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="type" required="true" type="string"> 

<!---
n <<NOTE_STRUCTURE>>
NOTE @<XREF:NOTE>@
|
n NOTE [<SUBMITTER_TEXT> | <NULL>]
+1 [CONC|CONT] <SUBMITTER_TEXT>
--->

	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
	
	<cfset tmp = find("@", tag)>
	<cfif tmp>
		<cfset setStr &= 'theXref="#getParams(tag, tmp)#"' & ", ">
	</cfif>

	<cfset tmp = find("NOTE", tag)>
 	<cfif tmp>
		<cfset setStr &= 'theNote="#getParams(tag, tmp, 4)#"' & ", ">
	</cfif>
	<cfset setStr &= replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->

	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= 'theType="#type#"' & ", ">
	 	<cfset setStr &= 'ownerID=#curUser#' & ", ">
	 	<cfset setStr &= 'linkID=#newUser#'>
		<cfoutput>			
		 	<cfquery name="AddNote" result="result" datasource="theData"> 
    			INSERT INTO Notes 
   			     	(ownerID, linkID)     
    			VALUES  
					(#curUser#, #newUser#) 
			</cfquery>
			<cfset noteID = result.GENERATEDKEY>
	
			<cfquery name="UpdateNote" result="result" datasource="theData"> 
				UPDATE  Notes 
				SET #setStr# WHERE 
					id = #noteID#;
			</cfquery>
		</cfoutput>
	</cfif>

<cfreturn> 
</cffunction>
		
 <cffunction name="getMedia" output="true" access="public"  hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 

<!---
n <<MULTIMEDIA_LINK>>
OBJE @<XREF:OBJE>@ |
n OBJE
+1 FILE <MULTIMEDIA_FILE_REFN> 
+2 FORM <MULTIMEDIA_FORMAT>
+3 MEDI <SOURCE_MEDIA_TYPE> 
+1 TITL <DESCRIPTIVE_TITLE>

--- or ---

OBJE 
+1 FILE
+1 FORM <MULTIMEDIA_FORMAT>
+2 MEDI <SOURCE_MEDIA_TYPE>
+1 TITL <DESCRIPTIVE_TITLE> --->	

 	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">

  	<cfset tmp = find("@", tag)>
	<cfif tmp>
		<cfset setStr &= 'theXref="#getParams(tag, tmp)#"' & ", ">
	</cfif>

  	<cfset tmp = find("FILE", tag)>
	<cfif tmp>
		<cfset setStr &= 'theFile="#getParams(tag, tmp)#"' & ", ">
	</cfif>

  	<cfset tmp = find("FORM", tag)>
	<cfif tmp>
		<cfset setStr &= 'theFormat="#getParams(tag, tmp)#"' & ", ">
	</cfif>

   	<cfset tmp = find("MEDI", tag)>
	<cfif tmp>
		<cfset setStr &= 'theMedia="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
 	<cfset tmp = find("TITL", tag)>
	<cfif tmp>
		<cfset setStr &= 'theTitle="#getParams(tag, tmp)#"' & ", ">
	</cfif>

	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= 'ownerID="#curUser#"' & ", ">
	 	<cfset setStr &= 'linkID="#newUser#"' >
	 	<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
	
		<cfoutput>			
			<cfquery name="AddMedia" result="result" datasource="theData"> 
	    		INSERT INTO Media 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset mediaID = result.GENERATEDKEY>
		
			<cfquery name="UpdateMedia" result="result" datasource="theData"> 
				UPDATE Media 
				SET #setStr# WHERE 
				id = #mediaID#;
			</cfquery>
		</cfoutput>
	</cfif>
<cfreturn> 
</cffunction>
		
 <cffunction name="getPlace" output="true" access="public" hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
 
 <!---
 PLAC <PLACE_NAME>
+1 FORM <PLACE_HIERARCHY>
+1 MAP
+2 LATI <PLACE_LATITUDE>
+2 LONG <PLACE_LONGITUDE>
+1 <<NOTE_STRUCTURE>>    
--->

	<cfset var setStr = "">
 	<cfset var result = "">
 	<cfset var tmp = "">
 	
  	<cfset tmp = find("PLAC",tag)>
	<cfif tmp>
		<cfset setStr &= 'thePlaceName="#getParams(tag, tmp)#"' & ", ">
	</cfif>

   	<cfset tmp = find("FORM",tag)>
	<cfif tmp>
		<cfset setStr &= 'thePlaceHierachy="#getParams(tag, tmp)#"' & ", ">
	</cfif>
 	
  	<cfset tmp = find("LATI",tag)>
	<cfif tmp>
		<cfset setStr &= 'theLattitude="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
  	<cfset tmp = find("LONG",tag)>
	<cfif tmp>
		<cfset setStr &= 'theLongitude="#getParams(tag, tmp)#"' & ", ">
	</cfif>
	
   	<cfset tmp = find("NOTE",tag)>
	<cfif tmp>
		<cfset getNote(tag, "Place")>
	</cfif>
	
	<cfif len(setStr) and debugOff>	
	 	<cfset setStr &= 'ownerID="#curUser#"' & ", ">
	 	<cfset setStr &= 'linkID="#newUser#"'>
		<cfset setStr = replace(setStr, "|", ",", "all")>					<!--- restore commas by replacing | with , --->
	
		<cfoutput>			
			<cfquery name="AddPlace" result="result" datasource="theData"> 
	    		INSERT INTO Places 
	        		(ownerID, linkID)     
	    		VALUES  
	    		    (#curUser#, #newUser#) 
			</cfquery>
			<cfset placeID = result.GENERATEDKEY>
		
			<cfquery name="UpdatePlaces" result="result" datasource="theData"> 
				UPDATE Places 
				SET #setStr# WHERE 
					id = #placeID#;
			</cfquery>
		</cfoutput>
	</cfif>
<cfreturn> 
</cffunction>

<cffunction name="getParams" output="true" access="public" hint="parsed all ADDR items from tag list" > 
    <cfargument name="tag" required="true" type="list"> 
    <cfargument name="tmp" required="true" type="numeric"> 
    <cfargument name="theLength" required="false" type="numeric"> 

	<cfset var temp1 = ""> 
	<cfset var temp3 = ""> 
	<cfset var curStart = 1>
	<cfset var curEnd = 1>
	
 	<cftry> 
 	 	<cfset curStart = REFind("\w*[A-Z]\w*[A-Z]\w*[A-Z]\w*[A-Z]\w*", tag, tmp, true)>	
		<cfset   curEnd = REFind("\w*[A-Z]\w*[A-Z]\w*[A-Z]\w*[A-Z]\w*", tag, tmp+curStart.LEN[1], true)>	
		<cfset tag = removeChars(tag,curStart.pos[1],4)>
		<cfset tag = insert(lcase(curStart.match[1]),tag,curStart.pos[1]-1)>						<!--- change tag to lowercase to remove it from subsequent searches --->
		<cfset temp1 = mid(tag,curStart.POS[1],curEnd.POS[1]-curStart.POS[1])>		
 		<cfset temp1 = listDeleteAt(temp1,1)>
		<cfset temp1 = ListChangeDelims(temp1," ")>
		<cfcatch>
 			<cfif tag is not "">
				<cfset temp1 = right(tag,len(tag)-curStart.POS[1]-4)>	
			<cfelse>
				<cfset temp1 = "">
 			</cfif>	
 		</cfcatch>
 	</cftry>
	<cfreturn temp1> 
</cffunction>

<cffunction name="dataFixes" output="true" access="public" hint="parsed all ADDR items from tag list" > 
    <cfargument name="dataList" required="true" type="list"> 

	<cfset dataList = replace(dataList, "SEX", "XSEX", "all")>					<!--- double at signs not allowed --->
    
 	<cfreturn dataList> 
</cffunction>

