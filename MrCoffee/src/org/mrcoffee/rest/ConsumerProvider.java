package org.mrcoffee.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.mrcoffee.entities.Consumer;
import org.mrcoffee.service.EntityIdVisitor;
import org.mrcoffee.service.GenericDataService;

@Stateless
@Path("/consumer")
public class ConsumerProvider {

	@Inject
	private GenericDataService dataService;

	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@TransactionAttribute(TransactionAttributeType.NEVER)
	public List<Consumer> getConsumers() {
		return dataService.getEntities(Consumer.class);
	}

	@POST
	@Consumes({MediaType.APPLICATION_JSON})
	@Produces({MediaType.APPLICATION_JSON})
	@TransactionAttribute(TransactionAttributeType.REQUIRED)
	public List<Consumer> createConsumers(List<Consumer> consumers) {
		return dataService.createEntities(consumers);
	}

	@PUT
	@Consumes({MediaType.APPLICATION_JSON})
	@Produces({MediaType.APPLICATION_JSON})
	@TransactionAttribute(TransactionAttributeType.REQUIRED)
	public List<Consumer> updateConsumers(List<Consumer> consumers) {
		return dataService.updateEntities(consumers);
	}

	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	@TransactionAttribute(TransactionAttributeType.REQUIRED)
	public void deleteConsumers(List<Consumer> consumers) {
		dataService.deleteEntities(Consumer.class, consumers, new ConsumerIdVistitor());
	}

	private static class ConsumerIdVistitor
		implements EntityIdVisitor<Consumer> {

		@Override
		public Object getId(Consumer entity) {
			return entity.getId();
		}

	}

}
