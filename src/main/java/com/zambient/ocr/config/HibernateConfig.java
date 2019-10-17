package com.zambient.ocr.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.sun.xml.internal.ws.model.JavaMethodImpl;

@Configuration
@EnableTransactionManagement
@ComponentScan({"com.zambient.ocr.config"})
@PropertySource(value={"classpath:application.properties"})
public class HibernateConfig {
	
	public HibernateConfig(){
		
	}
	
	@Autowired
	private Environment environment;
	
	@Bean
	public LocalSessionFactoryBean sessionFactory(){
		
		LocalSessionFactoryBean sessionFactory=new LocalSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		sessionFactory.setPackagesToScan(new String[]{"com.zambient.ocr.entity"});
		sessionFactory.setHibernateProperties(hibernateProperties());
		return sessionFactory;
	}
	
	@Bean
	public DataSource dataSource(){
		DriverManagerDataSource dataSource=new DriverManagerDataSource();
		dataSource.setDriverClassName(environment.getRequiredProperty("database.driver"));
		dataSource.setUrl(environment.getRequiredProperty("database.url"));
		dataSource.setUsername(environment.getRequiredProperty("database.user"));
		dataSource.setPassword(environment.getRequiredProperty("database.password"));
		return dataSource;
	}
	
	public Properties hibernateProperties(){
		Properties properties=new Properties();
		properties.put("hibernate.dialect", environment.getRequiredProperty("hibernate.dialect"));
		properties.put("hibernate.show_sql", environment.getRequiredProperty("hibernate.show_sql"));
		properties.put("hibernate.format_sql", environment.getRequiredProperty("hibernate.format_sql"));
		properties.put("hibernate.hbm2ddl.auto", environment.getRequiredProperty("hibernate.hbm2ddl.auto"));
		
		return properties;
	}
	
	@Bean
	public HibernateTransactionManager hibernateTransactionManager(SessionFactory sessionFactory){
		HibernateTransactionManager hibernateTransactionManager=new HibernateTransactionManager();
		hibernateTransactionManager.setSessionFactory(sessionFactory);
		return hibernateTransactionManager;
	}
	
	@Bean
	public JavaMailSenderImpl javaMailSenderImpl(){
		JavaMailSenderImpl javaMailSenderImpl=new JavaMailSenderImpl();
		javaMailSenderImpl.setHost(environment.getRequiredProperty("mail.host"));
		javaMailSenderImpl.setPort(Integer.parseInt(environment.getRequiredProperty("mail.port")));
		javaMailSenderImpl.setUsername(environment.getRequiredProperty("mail.username"));
		javaMailSenderImpl.setPassword(environment.getRequiredProperty("mail.password"));
		javaMailSenderImpl.setJavaMailProperties(mailProperties());
		
		return javaMailSenderImpl;
	}
	
	@Bean
	public SimpleMailMessage simpleMailMessage(){
		SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
		/*simpleMailMessage.setFrom(environment.getRequiredProperty("mail.username"));
		simpleMailMessage.setTo("mdrao.mk@gmail.com");*/
		return simpleMailMessage;
		
	}
	
	public Properties mailProperties(){
		
		Properties mailProp=new Properties();
		//mailProp.put("mail.transport.protocol", "smtp");
		mailProp.put("mail.smtp.auth", "true");
		mailProp.put("mail.smtp.starttls.enable", "true");
		mailProp.put("mail.smtp.ssl.trust", environment.getRequiredProperty("mail.host"));
		mailProp.put("mail.debug", "true");
		
		return mailProp;
	}
	

}
