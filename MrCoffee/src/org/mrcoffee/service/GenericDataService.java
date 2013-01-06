package org.mrcoffee.service;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.mrcoffee.annotations.DefaultDatabase;

@Stateless
@TransactionAttribute(TransactionAttributeType.SUPPORTS)
public class GenericDataService {

	@Inject
	@DefaultDatabase
	private EntityManager entityManager;

	@TransactionAttribute(TransactionAttributeType.MANDATORY)
    public <T> T create(T entity) {
        entityManager.persist(entity);
        entityManager.flush();
        entityManager.refresh(entity);
        return entity;
    }

    public <T> T find(Class<T> entityClass, Object entityId) {
       return entityManager.find(entityClass, entityId);
    }

    @TransactionAttribute(TransactionAttributeType.MANDATORY)
    public <T> void delete(Class<T> entityClass, Object entityId) {
       Object ref = entityManager.getReference(entityClass, entityId);
       entityManager.remove(ref);
    }

    @TransactionAttribute(TransactionAttributeType.MANDATORY)
    public <T> T update(T entity) {
        return entityManager.merge(entity);
    }

    public List<?> findWithNamedQuery(String namedQueryName){
        return entityManager.createNamedQuery(namedQueryName).getResultList();
    }

    public List<?> findWithNamedQuery(String namedQueryName, Map<String,Object> parameters){
        return findWithNamedQuery(namedQueryName, parameters, 0);
    }

    public List<?> findWithNamedQuery(String queryName, int resultLimit) {
        return entityManager.createNamedQuery(queryName).
                		setMaxResults(resultLimit).
                		getResultList();
    }

    @SuppressWarnings("unchecked")
	public <T> List<T> findByNativeQuery(String sql, Class<T> entityClass) {
        return entityManager.createNativeQuery(sql, entityClass).getResultList();
    }

    public List<?> findWithNamedQuery(String namedQueryName, Map<String,Object> parameters,int resultLimit){

	   Set<Entry<String, Object>> rawParameters = parameters.entrySet();
	   Query query = entityManager.createNamedQuery(namedQueryName);

	   if(resultLimit > 0) {
            query.setMaxResults(resultLimit);
       }

       for (Entry<String, Object> entry : rawParameters) {
            query.setParameter(entry.getKey(), entry.getValue());
       }

       return query.getResultList();
    }

    @SuppressWarnings("unchecked")
    public <T> List<T> findWithJpql(String queryText) {
		Query query = entityManager.createQuery(queryText);
		return query.getResultList();
    }

	public <T> List<T> getEntities(Class<T> entityClass) {
		String queryText = "SELECT o FROM " + entityClass.getSimpleName() + " o";
		return findWithJpql(queryText);
	}

}
