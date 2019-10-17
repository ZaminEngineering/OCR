package com.zambient.ocr.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class PdfToImage {
	
	public List pdfToImageGenerator(String path){
		
		String status=null;
		
		
	    String OUTPUT_DIR = Paths.get(path).toString();
		ArrayList imagesList=new ArrayList();
	    
		 try (final PDDocument document = PDDocument.load(new File(path))){
	            PDFRenderer pdfRenderer = new PDFRenderer(document);
	            int pageSize=document.getNumberOfPages();
	            imagesList.add(pageSize);
	            for (int page = 0; page < pageSize; ++page)
	            {
	                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 200, ImageType.RGB);
	                String fileName = OUTPUT_DIR + "image-" + page + ".png";
	                ImageIOUtil.writeImage(bim, fileName, 200);
	                imagesList.add(fileName);
	                status="success";
	            }
	            document.close();
	        } catch (IOException e){
	        	status="fail";
	            System.err.println("Exception while trying to create pdf document - " + e);
	        }
		
		 imagesList.add(status);
		return imagesList;
	}

   

    public static void main(String[] args) throws Exception{

    	PdfToImage pdfImage=new PdfToImage();
       List imagesList=pdfImage.pdfToImageGenerator("C:/Users/zamin/Desktop/pdfbox/Fiery_Color_005.pdf");
       System.out.print(imagesList.get(imagesList.size()-1));
    }

}