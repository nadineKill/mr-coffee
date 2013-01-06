package org.mrcoffee.factory;

import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.mrcoffee.annotations.DefaultDatabase;

public class DatabaseProducer {

    @PersistenceContext(unitName="MrCoffee")
    private EntityManager entityManager;

    @Produces
    @DefaultDatabase
    public EntityManager getDefaultDatabase() {
    	return entityManager;
    }

}
