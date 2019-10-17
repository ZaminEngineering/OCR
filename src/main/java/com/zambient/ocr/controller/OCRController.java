package com.zambient.ocr.controller;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.zambient.ocr.exceptions.AWSAccessDeniedException;
import com.zambient.ocr.model.Invoice;
import com.zambient.ocr.service.OCR;
import com.zambient.ocr.utils.InvoiceErrorMessages;

/**
 * <h3>OCRController</h3>
 * <p>This Controller class is will organize the rest calls related to the OCR APIs
 * 
 * @author Durga Rao Maruboina
 * @version 1.0
 * @since 2019
 */

@Controller
public class OCRController {
	
	@Autowired
	private OCR ocr;
	
	@Value("${ocr.images}")
	private String ocrImagesPath;
	
	
	private static final Logger logger=Logger.getLogger(OCRController.class);
	/**
	 * This method is used to call the ocrTextract service to Analyze the text from images
	 * 
	 * @param file
	 * @param ocrImagesPath
	 * @return 
	 */
	@RequestMapping(value="/fileUpload" , method=RequestMethod.POST)
	public ResponseEntity<Map> invoiceUpload(@RequestParam("bulkUploadFile") MultipartFile file,ModelMap model){
		logger.info("------controller intered into invoiceUpload() API------- "+file);
		  Map invoiceMap=null;
		try{
			if(file!=null){
				
				
				BufferedOutputStream bos =null;
	            try {
	                byte[] fileBytes = file.getBytes();
	                // location to save the file
	                String fileName = file.getOriginalFilename();
	                try {
	                    Path path = Paths.get(ocrImagesPath+fileName);
	                    Files.write(path, fileBytes);
	                } catch (IOException e) {
	                    e.printStackTrace();
	                    logger.error(e);
	                }
	               
	              
	                invoiceMap=(Map)ocr.awsTextract(ocrImagesPath+fileName);
	                
	                if(invoiceMap.keySet().size() <=0){
	                	
	                	
	                return new ResponseEntity(InvoiceErrorMessages.ERROR_INVALID_QUALITY,HttpStatus.BAD_REQUEST);
	                
	               
	                }
	                
	             
	               
	            } catch (IOException e) {
	                // TODO Auto-generated catch block
	            
	            	logger.error(e);
	                
	            }finally {
	                if(bos != null) {
	                    try {
	                        bos.close();
	                    } catch (IOException e) {
	                        // TODO Auto-generated catch block
	                        e.printStackTrace();
	                    }
	                }
	            }
				
				
			}else{
		        return new ResponseEntity(InvoiceErrorMessages.ERROR_FILE_NOT_FOUND,HttpStatus.BAD_REQUEST);
			}
			
			
		}catch(Exception exc){
			logger.error(exc);
			
			
		}
		
		
		return new ResponseEntity<Map>(invoiceMap,HttpStatus.OK);
		
	}
	
	
	@RequestMapping(value="/healthcheck" , method=RequestMethod.GET)
	public @ResponseBody String health(){
		System.out.println("OCRController.health()");
		return "up & Running..";
	}

}
