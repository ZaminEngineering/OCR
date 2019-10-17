package com.zambient.ocr.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.resource.transaction.spi.TransactionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.ui.ModelMap;

import com.zambient.ocr.entity.Users;
import com.zambient.ocr.exceptions.DatabaseException;

@Repository
public class UserDaoImpl implements UserDao {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public Integer userRegistration(Users users) {
		// TODO Auto-generated method stub
		Transaction tx=null;
		int id=0;
		try{
			
			System.out.println(users);
			Session session=sessionFactory.openSession();
		
			try{
		 tx=session.beginTransaction();
		tx.begin();
		id=(int) session.save(users);
			tx.commit();
			
			}catch(Exception exc){
				new DatabaseException("Transaction Unsuccessful");
				tx.rollback();
				
			}
			
		}catch(Exception exc){
			exc.printStackTrace();
		}
		return id;
	}


}
