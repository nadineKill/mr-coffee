package org.mrcoffee.service;

public interface EntityIdVisitor<T> {

	public Object getId(T entity);

}
