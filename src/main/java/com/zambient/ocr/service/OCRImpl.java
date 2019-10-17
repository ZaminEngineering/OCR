package com.zambient.ocr.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.amazonaws.SdkClientException;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.textract.AmazonTextract;
import com.amazonaws.services.textract.AmazonTextractClientBuilder;
import com.amazonaws.services.textract.model.Block;
import com.amazonaws.services.textract.model.DetectDocumentTextRequest;
import com.amazonaws.services.textract.model.DetectDocumentTextResult;
import com.amazonaws.services.textract.model.Document;
import com.zambient.ocr.exceptions.AWSAccessDeniedException;
import com.zambient.ocr.model.Invoice;
import com.zambient.ocr.model.InvoiceData;
import com.zambient.ocr.utils.PdfToImage;


/**
 * <h3>OCRImpl</h3>
 * <p>OCRImpl class is used to implement ocr operation by using aws textract service</p>
 * 
 * @author Durga Rao Maruboina
 * @version 1.0
 * @since 2019
 */

@Configuration
@Repository
public class OCRImpl implements OCR{
	
	@Value("${aws.bucket}")
	private String awsS3Bucket;
	@Autowired
	private PdfToImage pdfToImage;
	
	@Value("${aws.service_endpoint}")
	private String awsServiceEndpoint;
	
	@Value("${aws.signing_region}")
	private String awsSigningRegion;
	
	@Autowired
	private InvoiceData invoiceData;
	/*@Bean
	@Scope("prototype")
	public Invoice invoice(){
		return new Invoice();
	}*/
	
private static final Logger logger=Logger.getLogger(OCRImpl.class);
	
/*	@Autowired
	private Invoice invoice;*/
	
	
	

/**
 *This method converts given input string <code>columnData</code> to double value
 *
 * @param columnData
 * @return tempString as output
 * 
 */
	public static String stringToDouble(String columnData){
		String tempString=null;
		try{
		 // comma removing from string for convertion to double
		  columnData=columnData.replaceAll(",", "");
		  columnData=columnData.replace("/", "");
		  
		  //identify & remove if String contains more than one decimal(.) point
		  List<Integer> dotPositionsList=new ArrayList<Integer>();
		  int dotCounter=0;
		  for(int i=columnData.length()-1; i>=0; i-- ){
			   switch(columnData.charAt(i)){
			   case '.':
				   dotCounter=dotCounter+1;
				   if(dotCounter>1){
					   dotPositionsList.add(i);
				   }
				   
				   break;
			   }
		  }
		  
		  //remove positions
		  StringBuilder stringBuilder=new StringBuilder(columnData);
		  tempString=columnData;
		  for(int i=0;i<dotPositionsList.size();i++){
			  stringBuilder.deleteCharAt(dotPositionsList.get(i));
			  tempString= stringBuilder.toString();
		  }
		}catch(Exception exc){
		logger.error("Error at OCRImpl class : "+exc);
		}
		// DecimalFormat decimalFormatter = new DecimalFormat("#.##");	
		//return Double.parseDouble(tempString);
		return tempString;
	}

	
	/**
	 * This method is used to convert inpud pdf to plan text by using AWSTextract service
	 * @param uploadPath
	 * @param awsServiceEndpoint : fetching it from application.properties file
	 * @param awsSigningRegion   : fetching it from application.properties file
	 * @return 
	 */
	public Map awsTextract(String uploadPath) throws AWSAccessDeniedException {
		
	logger.info("--OCR controll inters into awsTextract API---");
		List<Invoice> invoiceObjList=null;
	
		 Map invoiceMap=new HashMap();
		try{
			
		
	     // The S3 bucket and document
	     // String document = "1.png";
	    	
	      //System.out.println("prop bucket :"+propBucket);
	    	
	     /* String bucket =awsS3Bucket;*/
	     // AmazonS3 s3client = AmazonS3ClientBuilder.standard().withEndpointConfiguration( new EndpointConfiguration("https://s3.amazonaws.com","us-east-2")).build();
	        
	     // Get the document from S3
	     /* com.amazonaws.services.s3.model.S3Object s3object = s3client.getObject(bucket, document);
	        S3ObjectInputStream inputStream = s3object.getObjectContent();
	        BufferedImage image = ImageIO.read(inputStream);

	     // Call DetectDocumentText
	        EndpointConfiguration endpoint = new EndpointConfiguration("https://textract.us-east-2.amazonaws.com", "us-east-2");
	        AmazonTextract client = AmazonTextractClientBuilder.standard().withEndpointConfiguration(endpoint).build();

	        DetectDocumentTextRequest request = new DetectDocumentTextRequest().withDocument(new Document().withS3Object(new S3Object().withName(document).withBucket(bucket)));    
	        DetectDocumentTextResult result = client.detectDocumentText(request);*/	
	        
	     // System.out.println("upload path :"+uploadPath);
	        
			
			/*Images Generation of input pdf file */
	        List imagesList=pdfToImage.pdfToImageGenerator(uploadPath);
	        
	     
	         if(imagesList.get(imagesList.size()-1).equals("success")){
	        	 
	        	 
	        	 BufferedWriter bufferedWriter = null;
				try {
					bufferedWriter = new BufferedWriter(new FileWriter(new File(Paths.get(uploadPath).getParent().toString()+"/invoice.txt")));
				} catch (IOException e) {
					// TODO Auto-generated catch block
					logger.error(e);
				}
				
	        	 List<String> invoiceList=new ArrayList<String>();
	        	
	        	   /*Looping each gaenerated image to aws service to analyze the data*/
	        	 for(int image=1;image <=(int)imagesList.get(0);image++){
	        	 
	        String document1=imagesList.get(image).toString();
	        ByteBuffer imageBytes = null;
	        
	        try (InputStream inputStream = new FileInputStream(new File(document1))) {
	         imageBytes = ByteBuffer.wrap(IOUtils.toByteArray(inputStream));
	        } catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
			logger.error(e);
			} catch (IOException e) {
				// TODO Auto-generated catch block
		    logger.error(e);
			}
	        
	        
	       // AmazonTextract client = AmazonTextractClientBuilder.defaultClient();
	        
	        /*Connectivity with AWSTEXTRACT service*/
	        EndpointConfiguration endpoint = new EndpointConfiguration(awsServiceEndpoint, awsSigningRegion);
	        AmazonTextract client = AmazonTextractClientBuilder.standard().withEndpointConfiguration(endpoint).build();
	        
	        
	       // AmazonTextract client = AmazonTextractClientBuilder.standard().withRegion(Regions.US_EAST_2).build();
	     
	        /*Text Detection operation with the AWS Textract service*/
	        DetectDocumentTextRequest request = new DetectDocumentTextRequest().withDocument(new Document().withBytes(imageBytes));
	        DetectDocumentTextResult result = client.detectDocumentText(request);
	        
	        
	        
	      /*  AnalyzeDocumentRequest request1 = new AnalyzeDocumentRequest().withFeatureTypes("TABLES").withDocument(new Document().withBytes(imageBytes));
	                  
	        AnalyzeDocumentResult result1 = client.analyzeDocument(request1);*/
	        
	  
	        

	        /*Detected data saving into <code>invoiceList</code> and writing in to the file <code>invoice.txt</code> for forther operation*/
	        List<Block> blocks = result.getBlocks();
	        for (Block block : blocks) {
	          //  DisplayBlockInfo(block);
	            switch(block.getBlockType()) {
	            
	            case "LINE":
	            	
	            	String data=block.getText();
	            	invoiceList.add(data);
	            	//System.out.println(data);
	            	try {
						bufferedWriter.write(data+"\n");
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
	            	
	            	break;
	            
	          /*  case "KEY_VALUE_SET":
	                if (block.getEntityTypes().contains("KEY")){
	                 
	                	System.out.println(block.getText());
	                	// ShowBoundingBox(height, width, block.getGeometry().getBoundingBox(), g2d, new Color(255,0,0));
	                }
	                else {  //VALUE
	                   // ShowBoundingBox(height, width, block.getGeometry().getBoundingBox(), g2d, new Color(0,255,0));
	                	System.out.println(block.getGeometry().getBoundingBox());
	                }
	                break;
	            case "TABLE":
	               
	            	System.out.println(block.withBlockType(BlockType.CELL).getText());
	            	// ShowBoundingBox(height, width, block.getGeometry().getBoundingBox(), g2d, new Color(0,0,255));
	                break;
	            case "CELL":
	             
	            	System.out.println(block.getText());
	            	//  ShowBoundingBox(height, width, block.getGeometry().getBoundingBox(), g2d, new Color(255,255,0));
	                break;*/
	          
	            default:
	                //PAGE, LINE & WORD
	                //ShowBoundingBox(height, width, block.getGeometry().getBoundingBox(), g2d, new Color(200,200,0));
	            }
	        }
	        bufferedWriter.flush();
	        
	        
	   	/*Deleting the generated images from input pdf file*/
	   	 try{
	   		 
	   		 Path pathToBeDeleted = Paths.get(document1);

	   	        try {
	   	            Files.delete(pathToBeDeleted);
	   	        } catch (IOException e) {
	   	            logger.error(e);
	   	        }
	   	 }catch(Exception exc){
	   		 logger.error(exc);
	   	 }
	      
	         }
	        	 
	        	 
	        	
	        	 /*Each record will be stored in to the <code>invoiceObjList</code>*/
	        	invoiceObjList=new ArrayList<Invoice>();
	        	 
	        	/*Fetching <code>invoiceList</code> data and detecting the rows data */
	        	 for(int globalIndex=0;globalIndex<invoiceList.size();globalIndex++){
	        		 
	        		 try{
	        		
	        			 
	        			 if (invoiceList.get(globalIndex).contains("Invoice Date:")){

	        				 globalIndex=globalIndex+1;
	        				 invoiceData.setInvoiceDate(invoiceList.get(globalIndex));
	        				
	        		       }else if(invoiceList.get(globalIndex).contains("Btl Rate") || invoiceList.get(globalIndex).contains("Btt Rate") || invoiceList.get(globalIndex).contains("Bti Rate")){
	        		    	   
	        		    	   
	        		    	   globalIndex=globalIndex+1;
	        		    	   int columnTemp=0;
	        		    	   
	        		    	   for(int table=globalIndex; table<invoiceList.size(); table++){
	        		    		   
	        		    		 
	        		    		   
	        		    		   if(!invoiceList.get(table).contains("TIN")){
	        		    			   
	        		    			   try{
	        		    		   
	        		    				   
	        		    			   Invoice invoice=new Invoice();  //Invoice object creation
	        		    				 
	        		    			   String brandNameAppender="";
	        		    		   
	        		    		   String rowData=invoiceList.get(table);
	        		    		   rowData=rowData.replace(",", "");
	        		    		   rowData=rowData.replace("/", "");
	        		    		   rowData=rowData.trim();
	        		    		   boolean rowGenerator=true;
	     		    		            
	     		    		   
	     		    		              if(NumberUtils.isParsable(rowData)){ //This is UnitRate value
	     		    		            	  
	     		    		            	  
	        		    		   
	        		    		   for(int column=table; column<table+11; column++){
	        		    		   
	        		    			   try{
	        		    			   String columnData=invoiceList.get(column);
	        		    		    
	        		    		            
	        		    		            	  
	        		    		            	 
	        		    		            	  if(columnData.contains(".")){  // UnitRate value
	        		    		            		  
	        		    		            		  // comma removing from string for convertion to double
	        		    		            		  //identify & remove if String contains more than one decimal(.) point and /
	        		    		            		 String unitRateValue= stringToDouble(columnData); //only one decimal value as result
	        		    		            		  
	        		    		            		  
	        		    		            		  invoice.setUnitRate(unitRateValue);
	        		    		            		  
	        		    		            	  }else if((columnData.length() <5 && columnData.contains("Beer") )|| columnData.length() <5 && columnData.contains("IML")){
	        		    		            		  
	        		    		            		  invoice.setProductType(columnData);
	        		    		            		  
	        		    		            	  }else if((columnData.contains("/") && columnData.contains("ml") ) || (columnData.contains("(") && columnData.contains("ml") )){
	        		    		            		  
	        		    		            		  invoice.setPackQty(columnData);
	        		    		            		  
	        		    		            		  //gather cases delivered and bottles delivered details
	        		    		            		  column=column+1;

	        		    		            		  if(invoiceList.get(column).contains(".") && invoiceList.get(column).contains("/")){
		        		    		            			  String unitRateValue= stringToDouble(columnData); //only one decimal value as result
		            		    		            		  invoice.setUnitRate(unitRateValue);
		            		    		            		  column=column+1;
		        		    		            		  }
	        		    		            		  
	        		    		            		  if(invoiceList.get(column).equalsIgnoreCase("o")){
		        		    		            			  int value=0;
		        		    		            		  invoice.setCaseDeliveredQty(value);
		        		    		            		  }else{
		        		    		            			  try{
		        		    		            			  invoice.setCaseDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
		        		    		            			  }catch(Exception exc){
		        		    		            				  
		        		    		            			  }
		        		    		            			  }
		        		    		            		  column=column+1;
		        		    		            		  
		        		    		            		 if(invoiceList.get(column).equalsIgnoreCase("o")){
	        		    		            			  int value=0;
	        		    		            		  invoice.setBottelsDeliveredQty(value);
	        		    		            		  }else{
	        		    		            			  try{
	        		    		            			  invoice.setBottelsDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
	        		    		            			  }catch(Exception exc){
	        		    		            				  
	        		    		            			  }
	        		    		            			  }
	        		    		            		  
	        		    		            		  column=column+1;
	        		    		            		  invoice.setTotal( stringToDouble(invoiceList.get(column)));
	        		    		            		  column=column+1;
	        		    		            		  invoice.setBillRate( stringToDouble(invoiceList.get(column)));
	        		    		            		  
	        		    		            	  }else{
	        		    		            		  
	        		    		            		  if(NumberUtils.isParsable(columnData)){ 
	        		    		            			  System.out.println("SI No. :"+columnData);
	        		    		            			  
	        		    		            			   if(columnData.length()>=4){ //Brand Number
	                		    		            		  long brandNumber=Long.parseLong(columnData);
	                		    		            	
	                		    		            		  invoice.setBrandNumber(brandNumber);
	                		    		            
	                		    		            	  }
	        		    		            			  
	        		    		            		  }else {
	        		    		            			  
	        		    		            			  if(columnData.length()==1){     //Pack Type
	        		    		            				  invoice.setPackType(columnData);
	        		    		            				  
	        		    		            		         }else{   //Brand Name
	        		    		            		        	 brandNameAppender=brandNameAppender+""+columnData;
	        		    		            		        	 
	        		    		            		        	 
	        		    		            		        	 invoice.setBrandName(columnData);
	        		    		            		         }
	        		    		            			  
	        		    		            		  }
	        		    		            		  
	        		    		            	  }
	        		    		            	  
	        		    		            	  
	 
	        		    		   }catch(Exception exc){
	        		    		   }
	        		    			   columnTemp=column;
	        		    	         }
	        		    	  
	     		    		              }else{
	     		    		            	 brandNameAppender=brandNameAppender+""+rowData;
	     		    		            	  
	     		    		            	  // Two Brand Name lines , if it reads first then Util rate value
	     		    		            	
	  		        		    		    
	     		    		            	 table=table+1;
	    		    		            	  if(invoiceList.get(table).contains(".")){ 
	     		    		            	  
	     		    		            	  
	     		        		    		   for(int column=table; column<table+6; column++){
	     		        		    			   try{
	     		        		    		   
	     		        		    			   String columnData=invoiceList.get(column);
	     		        		    		    
	     		        		    		            	  if(columnData.contains(".")){  // UnitRate value
	     		        		    		            		  
	     		        		    		            		  // comma removing from string for convertion to double
	     		        		    		            		  //identify & remove if String contains more than one decimal(.) point and /
	     		        		    		            		 String unitRateValue= stringToDouble(columnData); //only one decimal value as result
	     		        		    		            		  
	     		        		    		            		  
	     		        		    		            		  invoice.setUnitRate(unitRateValue);
	     		        		    		            		  
	     		        		    		            	  }else if((columnData.length() <5 && columnData.contains("Beer") )|| columnData.length() <5 && columnData.contains("IML")){
	     		        		    		            		  
	     		        		    		            		  invoice.setProductType(columnData);
	     		        		    		            		  
	     		        		    		            	  }else if((columnData.contains("/") && columnData.contains("ml") ) || (columnData.contains("(") && columnData.contains("ml") )){
	     		        		    		            		  
	     		        		    		            		  invoice.setPackQty(columnData);
	     		        		    		            		  
	     		        		    		            		  //gather cases delivered and bottles delivered details
	     		        		    		            		  column=column+1;
	     		        		    		            		  
	     		        		    		            		  if(invoiceList.get(column).contains(".") && invoiceList.get(column).contains("/")){
	     		        		    		            			  String unitRateValue= stringToDouble(columnData); //only one decimal value as result
	     		            		    		            		  invoice.setUnitRate(unitRateValue);
	     		            		    		            		  column=column+1;
	     		        		    		            		  }
	     		        		    		            		  
	     		        		    		            		  if(invoiceList.get(column).equalsIgnoreCase("o")){
	     		        		    		            			  int value=0;
	     		        		    		            		  invoice.setCaseDeliveredQty(value);
	     		        		    		            		  }else{
	     		        		    		            			  invoice.setCaseDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
	     		        		    		            		  }
	     		        		    		            		  column=column+1;
	     		        		    		            		  
	     		        		    		            		 if(invoiceList.get(column).equalsIgnoreCase("o")){
	    		        		    		            			  int value=0;
	    		        		    		            		  invoice.setBottelsDeliveredQty(value);
	    		        		    		            		  }else{
	    		        		    		            			  invoice.setBottelsDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
	    		        		    		            		  }
	     		        		    		            		 
	     		        		    		            		  column=column+1;
	     		        		    		            		  invoice.setTotal( stringToDouble(invoiceList.get(column)));
	     		        		    		            		  column=column+1;
	     		        		    		            		  brandNameAppender=brandNameAppender+" "+invoiceList.get(column);
		        		    		            		          invoice.setBrandName(brandNameAppender);
	     		        		    		            		  column=column+1;
	     		        		    		            		  invoice.setBillRate( stringToDouble(invoiceList.get(column)));
	     		        		    		            		  
	     		        		    		            	  }else{
	     		        		    		            		  
	     		        		    		            		  if(NumberUtils.isParsable(columnData)){ 
	     		        		    		            			  System.out.println("SI No. :"+columnData);
	     		        		    		            			  
	     		        		    		            			   if(columnData.length()>=4){ //Brand Number
	     		                		    		            		  long brandNumber=Long.parseLong(columnData);
	     		                		    		            	
	     		                		    		            		  invoice.setBrandNumber(brandNumber);
	     		                		    		            
	     		                		    		            	  }
	     		        		    		            			  
	     		        		    		            		  }else {
	     		        		    		            			  
	     		        		    		            			  if(columnData.length()==1){     //Pack Type
	     		        		    		            				  invoice.setPackType(columnData);
	     		        		    		            				  
	     		        		    		            		         }else{   //Brand Name
	     		        		    		            		        	 brandNameAppender=brandNameAppender+" "+columnData;
	     		        		    		            		        	 
	     		        		    		            		        	 
	     		        		    		            		        	 invoice.setBrandName(columnData);
	     		        		    		            		         }
	     		        		    		            			  
	     		        		    		            		  }
	     		        		    		            		  
	     		        		    		            	  }
	     		        		    		            	  
	     		        		    		            	  
	     		        		    		              
	     		        		    		             
	     		        		    		              
	     		        		    		   }catch(Exception exc){
	     		        		    		   }
	     		        		    			  columnTemp=column;
	     		        		    	         }
	    		    		            	  }else if(((invoiceList.get(table).contains("/") && invoiceList.get(table).contains("ml")) || (invoiceList.get(table).contains("(") && invoiceList.get(table).contains("ml")) ) || (NumberUtils.isParsable(invoiceList.get(table)) && invoiceList.get(table).length()>=4) ||(invoiceList.get(table).equals("Beer"))){
	    		    		            		  
	    		    		            		//If first data is BrandName then Brand Number  
	    		    		            		  
	    		    		            		   for(int column=table; column<table+6; column++){
	    		    		            			   try{
	    	     		        		    		   
	         		        		    			   String columnData=invoiceList.get(column);
	         		        		    		    
	         		        		    		            	  if(columnData.contains(".")){  // UnitRate value
	         		        		    		            		  
	         		        		    		            		  // comma removing from string for convertion to double
	         		        		    		            		  //identify & remove if String contains more than one decimal(.) point and /
	         		        		    		            		 String unitRateValue= stringToDouble(columnData); //only one decimal value as result
	         		        		    		            		  
	         		        		    		            		  
	         		        		    		            		  invoice.setUnitRate(unitRateValue);
	         		        		    		            		  
	         		        		    		            	  }else if((columnData.length() <5 && columnData.contains("Beer") )|| columnData.length() <5 && columnData.contains("IML")){
	         		        		    		            		  
	         		        		    		            		  invoice.setProductType(columnData);
	         		        		    		            		  
	         		        		    		            	  }else if((columnData.contains("/") && columnData.contains("ml") ) || (columnData.contains("(") && columnData.contains("ml") )){
	         		        		    		            		  
	         		        		    		            		  invoice.setPackQty(columnData);
	         		        		    		            		  
	         		        		    		            		 
	         		        		    		            		  
	         		        		    		            	  }else{
	         		        		    		            		  
	         		        		    		            		  if(NumberUtils.isParsable(columnData)){ 
	         		        		    		            			  System.out.println("SI No. :"+columnData);
	         		        		    		            			  
	         		        		    		            			   if(columnData.length()>=4){ //Brand Number
	         		                		    		            		  long brandNumber=Long.parseLong(columnData);
	         		                		    		            	
	         		                		    		            		  invoice.setBrandNumber(brandNumber);
	         		                		    		            
	         		                		    		            	  }
	         		        		    		            			  
	         		        		    		            		  }else {
	         		        		    		            			  
	         		        		    		            			  if(columnData.length()==1){     //Pack Type
	         		        		    		            				  invoice.setPackType(columnData);
	         		        		    		            				  
	         		        		    		            				 //gather cases delivered and bottles delivered details
	                 		        		    		            		  column=column+1;
	                 		        		    		            		  
	                 		        		    		            		
	                 		        		    		            		 if(invoiceList.get(column).contains(".") && invoiceList.get(column).contains("/")){
	                		        		    		            			  String unitRateValue= stringToDouble(columnData); //only one decimal value as result
	                		            		    		            		  invoice.setUnitRate(unitRateValue);
	                		            		    		            		  column=column+1;
	                		        		    		            		  }
	                 		        		    		            		  
	                 		        		    		            		  if(invoiceList.get(column).equalsIgnoreCase("o")){
	                 		        		    		            			  int value=0;
	                 		        		    		            		  invoice.setCaseDeliveredQty(value);
	                 		        		    		            		  }else{
	                 		        		    		            			  invoice.setCaseDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
	                 		        		    		            		  }
	                 		        		    		            		  column=column+1;
	                 		        		    		            		  
	                 		        		    		            		 if(invoiceList.get(column).equalsIgnoreCase("o")){
	                		        		    		            			  int value=0;
	                		        		    		            		  invoice.setBottelsDeliveredQty(value);
	                		        		    		            		  }else{
	                		        		    		            			  invoice.setBottelsDeliveredQty(Integer.parseInt(invoiceList.get(column).trim()));
	                		        		    		            		  }
	                 		        		    		            		  
	                 		        		    		            		  
	                 		        		    		            		  column=column+1;
	                 		        		    		            		  invoice.setTotal( stringToDouble(invoiceList.get(column)));
	                 		        		    		            		  
	                 		        		    		            		  column=column+1;
	                 		        		    		            		  brandNameAppender=brandNameAppender+" "+invoiceList.get(column);
	            	        		    		            		          invoice.setBrandName(brandNameAppender);
	                 		        		    		            		  column=column+1;
	                 		        		    		            		  invoice.setBillRate( stringToDouble(invoiceList.get(column)));
	         		        		    		            				  
	         		        		    		            		         }else{   //Brand Name
	         		        		    		            		        	 brandNameAppender=brandNameAppender+" "+columnData;
	         		        		    		            		        	 
	         		        		    		            		        	 
	         		        		    		            		        	 invoice.setBrandName(columnData);
	         		        		    		            		         }
	         		        		    		            			  
	         		        		    		            		  }
	         		        		    		            		  
	         		        		    		            	  }
	         		        		    		            	  
	         		        		    		            	  
	         		        		    		              
	         		        		    		            
	         		        		    		              
	    		    		            		   }catch(Exception exc){
	    		    		            		   }
	    		    		            			   columnTemp=column;
	         		        		    		              
	         		        		    	         }
	    		    		            		  
	    		    		            		  
	    		    		            	  }else{
	    		    		            		  columnTemp=columnTemp+1;
	    		    		            		  rowGenerator=false;
	    		    		            		 
	    		    		            	  }
	     		    		            	 
	     		    		            	  
	     		    		            	  
	     		    		              }
	        		    	   
	     		    		              if(rowGenerator==true){
	     		    		             invoiceObjList.add(invoice);
	     		    		              }
	        		    			   }catch(Exception exc){
	        		    				   exc.printStackTrace();
	        		    			   }
	        		    			   invoiceMap.put(0, invoiceObjList);
	        		    		   }else{
	        		    			   
	        		    			   try{
	        		    			   
	        		    			   
	        		    			   //After TIN values
	        		    			   System.out.println("After TIN");
	        		    			   
	        		    			  int salesIndex= invoiceList.indexOf("Sales");
	        		    			  
	        		    			  if(salesIndex!=0){
	        		    				  
	        		    			  invoiceData.setSalesValue(invoiceList.get((salesIndex+1)));
	        		    			  }else{
	        		    				  invoiceData.setSalesValue("null");
	        		    			  }
	        		    			
	        		    			  
	        		    			  int mrpIndex= invoiceList.indexOf("MRP");
	        		    			  if(mrpIndex!=0){
	        		    				  String value=invoiceList.get((mrpIndex+1));
	        		    				  if(value.contains(".")){
	        		    			  invoiceData.setMrpRoundingOff(value);
	        		    				  }else{
	        		    					  int rounding= invoiceList.indexOf("Rounding");
	        		    					  if(rounding!=0){
	        		    						  invoiceData.setMrpRoundingOff(invoiceList.get((rounding+1)));
	        		    					  }else{
	        		    						  invoiceData.setMrpRoundingOff("null");
	        		    					  }
	        		    				  }
	        		    			  }else{
	        		    				  invoiceData.setMrpRoundingOff("null");	  
	        		    			  }
	        		    			  
	        		    			  
	        		    			  int retailIndex= invoiceList.indexOf("Retail Shop Excise Turnover Tax:");
	        		    			  if(retailIndex!=0){
	        		    			  invoiceData.setRetailShopExciseTurnoverTax(invoiceList.get((retailIndex+1)));
	        		    			  }else{
	        		    				  invoiceData.setRetailShopExciseTurnoverTax("null");
	        		    			  }
	        		    			 
	        		    			  
	        		    			  int tcsIndex= invoiceList.indexOf("TCS:");
	        		    			  invoiceData.setTcs(invoiceList.get((tcsIndex+1)));
	        		    			
	        		    			   
	        		    			  int retailerIndex= invoiceList.indexOf("Retailer Credit Balance:");
	        		    			  if(retailerIndex!=0){
	        		    				  
	        		    				  if(invoiceList.get((retailerIndex)).contains("Rs.")){
	        		    					  String[] split=invoiceList.get((retailerIndex)).split(":");
	        		    					  invoiceData.setRetailerCreditBalance(split[1]); 
	        		    					  
	        		    				  }else{
	        		    				  
	        		    			  invoiceData.setRetailerCreditBalance(invoiceList.get((retailerIndex+1) ));
	        		    				  }
	        		    			  }else{
	        		    				  invoiceData.setRetailerCreditBalance("null"); 
	        		    			  }
	        		    			  
	        		    		   }catch(Exception exc){
	        		    			   
	        		    		   }
	        		    			  
	        		    			  invoiceMap.put(1, invoiceData);
	        		    			
	        		    			  break;
	        		    		   }
	        		    		   table=columnTemp;
	        		    	   }
	        		    	  
	        		    	   
	        		    	   
	        		    	   
	        		    	   
	        		       }
	        				 
	        			 
	        		 
	        		 }catch(Exception exc){
	        			 exc.printStackTrace();
	        		 }
	        	 }
	        	 
	        	 
	        	 
	        	 //print output
	        	/* System.out.println("***********************************************");
	        	 invoiceObjList.stream().forEach(System.out::println);
	        	 
	        	 System.out.println("*************************************************");
	               System.out.println("Sales Value : "+invoiceData.getSalesValue());
	               System.out.println("MRP Rounding Off : "+invoiceData.getMrpRoundingOff());
	               System.out.println("Retail Shop Excise Turnover Tax : "+invoiceData.getRetailShopExciseTurnoverTax());
	               System.out.println("TCS : "+invoiceData.getTcs());
	               System.out.println("Retailer Credit Balance : "+invoiceData.getRetailerCreditBalance());*/
	        	
	    }
	      
		}catch(Exception exc){
			logger.error(exc);
			
			throw new AWSAccessDeniedException(exc.getCause());
			
			

			/*if(exc.getClass().getCanonicalName().equalsIgnoreCase("com.amazonaws.SdkClientException")){
				try {
					throw new AWSAccessDeniedException(exc.getCause().getLocalizedMessage());
				} catch (AWSAccessDeniedException e) {
					// TODO Auto-generated catch block
					logger.error(e);
				}
			}*/
			 
			
		  
			
		}
		
		
		
		return invoiceMap;
	}

}
