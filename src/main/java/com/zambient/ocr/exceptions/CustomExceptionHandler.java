package com.zambient.ocr.exceptions;

import java.util.ArrayList;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


/**
 *This class used to handle application Exceptions Using <code>@ControllerAdvice and @ExceptionHandler</code>
 *  classes
 * 
 */
@ControllerAdvice
public class CustomExceptionHandler{
	
	private static final Logger logger=Logger.getLogger(CustomExceptionHandler.class);
	
	/**
	 * This method is used to Handle the Exceptions of awsTextract Api 
	 * 
	 * @param AWSAccessDeniedException
	 * @param ResponseEntity
	 * @param ErrorResponse
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(AWSAccessDeniedException.class)
	public ResponseEntity<ErrorResponse> awsTextractExceptionHandler(Exception ade){
		logger.info("ACCESS denied exception handled in controller advice"+ade);
		ErrorResponse errorResponse=new ErrorResponse();
		errorResponse.setMessage("Bad request");
		List<String> errorList=new ArrayList();
		errorList.add(ade.getCause().toString());
		errorResponse.setDetails(errorList);
		return new ResponseEntity<ErrorResponse>(errorResponse,HttpStatus.BAD_REQUEST);
	}
	
/*	@ExceptionHandler(Exception.class)
	public ModelAndView handleSQLException(Exception ex){
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("Error");
		modelAndView.addObject("message", ex.getMessage());
		//ex.printStackTrace();
		return modelAndView;
	}*/

	@ExceptionHandler(DatabaseException.class)
	public ResponseEntity<Integer> databaseException(DatabaseException exc){
		System.out.println("db exception :"+exc);
		return new ResponseEntity<Integer>(0,HttpStatus.EXPECTATION_FAILED);
	}
	
	
	@ExceptionHandler(MailException.class)
	public ResponseEntity mailExeption(MailException exc){
		
		return new ResponseEntity("Mail Exception",HttpStatus.BAD_REQUEST);
	}
	
}
